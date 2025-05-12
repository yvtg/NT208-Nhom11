import database from "../config/database.js";
import bcrypt from "bcrypt";

// lấy thông tin toàn bộ người dùng có trong database
const getUsers = async (req, res) => {
  try {
    const result = await database.query('SELECT * FROM users');
    console.log("Users:", result.rows);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// lấy thông tin người dùng theo ID
const getUserById = async (req, res) => {
  try 
  {
    const { id } = req.params;
    const result = await database.query('SELECT * FROM users WHERE userid = $1', [parseInt(id)]);
    const user = result.rows[0];
    return res.status(200).json(user || {});
  } 
  catch (error) 
  {
    console.error("Get user by id error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// lấy thông tin người dùng hiện tại
const getCurrentUser = async (req, res) => {
  try {
    // Lấy userId từ token đã được xác thực trong middleware
    const userId = req.userId;

    console.log(userId);

    // Truy vấn thông tin user từ database sử dụng cú pháp PostgreSQL
    const result = await database.query(
    `SELECT 
        u.userid,
        u.username,
        u.email,
        u.avatarurl,
        u.phonenumber,
        up.title,
        up.introduce,
        up.cv_url,
        up.skills,
        f.field_name
      FROM users u
      LEFT JOIN user_profile up ON u.userid = up.userid
      LEFT JOIN fields f ON up.field_id = f.field_id
      WHERE u.userid = $1`,
      [userId]
    );


    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy thông tin người dùng" });
    }

    // Loại bỏ mật khẩu trước khi trả về kết quả
    delete user.password;

    return res.status(200).json(user);
  } catch (error) {
    console.error("Lỗi lấy thông tin người dùng hiện tại:", error);
    return res.status(500).json({ error: "Lỗi server nội bộ" });
  }
}

// cập nhật profile
const updateProfile = async (req, res) => {
  try {
    // Lấy userId từ token đã được xác thực trong middleware
    const userId = req.userId;

    // thông tin đổi profile
    const { avatarurl, username, email, phonenumber } = req.body;

    // Kiểm tra xem trường nào là null và giữ lại giá trị cũ
    const updates = [];
    const values = [];

    if (avatarurl !== null || avatarurl !== "") {
      updates.push("avatarurl = $1");
      values.push(avatarurl);
    }
    if (username !== null || username !== "") {
      updates.push("username = $2");
      values.push(username);
    }
    if (email !== null || email !== "") {
      updates.push("email = $3");
      values.push(email);
    }
    if (phonenumber !== null || phonenumber !== "") {
      updates.push("phonenumber = $4");
      values.push(phonenumber);
    }

    // Thêm userId vào cuối list giá trị
    values.push(userId);

    if (updates.length > 0) {
      const query = `UPDATE users SET ${updates.join(', ')} WHERE userid = $${userId}`;
      await database.query(query, values);
      
      return res.status(200).json({ message: "Cập nhật thông tin người dùng thành công" });
    } else {
      return res.status(400).json({ message: "Không có thông tin nào để cập nhật" });
    }

  } catch (error) {
    console.error("Lỗi cập nhật thông tin người dùng:", error);
    return res.status(500).json({ error: "Lỗi server nội bộ" });
  }
}

// cập nhật mật khẩu
const updatePassword = async (req, res) => {
  try {
    const userId = req.userId; // lấy userId từ token 
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Kiểm tra xem mật khẩu cũ có chính xác không
    const result = await database.query('SELECT password FROM users WHERE userid = $1', [userId]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy thông tin người dùng" });
    }

    // Sử dụng bcrypt.compare để so sánh mật khẩu cũ
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    // Kiểm tra mật khẩu cũ
    if (!isOldPasswordValid) {
      return res.status(401).json({ message: "Mật khẩu cũ không chính xác" });
    }

    // Kiểm tra xem mật khẩu mới và xác nhận mật khẩu có giống nhau không
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu mới không khớp" });
    }

    // Cập nhật mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await database.query('UPDATE users SET password = $1 WHERE userid = $2', [hashedPassword, userId]);
    
    return res.status(200).json({ message: "Mật khẩu đã được cập nhật thành công" });
  }
  catch (error) {
    console.error("Lỗi cập nhật mật khẩu:", error);
    return res.status(500).json({ error: "Lỗi server nội bộ" });
  }
}

// cập nhật cv
const updateCV = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, personal_website, cv_url, field_id, skills, introduce } = req.body;

    // kiểm tra null và giữ lại giá trị cũ
    const updates = [];
    const values = [];

    if (title !== null || title !== "") {
      updates.push("title = $1");
      values.push(title);
    }
    if (personal_website !== null || personal_website !== "") {
      updates.push("personal_website = $2");
      values.push(personal_website);
    }
    if (cv_url !== null || cv_url !== "") {
      updates.push("cv_url = $3");
      values.push(cv_url);
    }
    if (field_id !== null || field_id !== "") {
      updates.push("field_id = $4");
      values.push(field_id);
    }
    if (skills !== null || skills !== "") {
      updates.push("skills = $5");
      values.push(skills);
    }
    if (introduce !== null || introduce !== "") {
      updates.push("introduce = $6");
      values.push(introduce);
    }

    // cập nhật cv
    const query = `UPDATE user_profile SET ${updates.join(', ')} WHERE userid = $${userId}`;
    await database.query(query, values);

    return res.status(200).json({ message: "Cập nhật cv thành công" });
    
  }
  catch (error) {
    console.error("Lỗi cập nhật cv:", error);
    return res.status(500).json({ error: "Lỗi server nội bộ" });
  }
}

export { getUsers, getUserById, getCurrentUser, updateProfile, updatePassword, updateCV };
