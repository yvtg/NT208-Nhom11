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
    [parseInt(id)]);
    
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
    const userId = req.userId;
    const { avatarurl, username, email, phonenumber } = req.body;

    const updates = [];
    const values = [];
    let paramIndex = 1;

    // Kiểm tra và thêm từng trường nếu hợp lệ
    if (typeof avatarurl === 'string' && avatarurl.trim() !== '') {
      updates.push(`avatarurl = $${paramIndex++}`);
      values.push(avatarurl.trim());
    }

    if (typeof username === 'string' && username.trim() !== '') {
      // Kiểm tra trùng username
      const userRes = await database.query('SELECT userid FROM users WHERE username = $1 AND userid <> $2', [username, userId]);
      if (userRes.rows.length > 0) {
        return res.status(400).json({ message: 'Tên người dùng đã tồn tại' });
      }
      updates.push(`username = $${paramIndex++}`);
      values.push(username.trim());
    }

    if (typeof email === 'string' && email.trim() !== '') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        return res.status(400).json({ message: 'Email không hợp lệ' });
      }

      const emailRes = await database.query('SELECT userid FROM users WHERE email = $1 AND userid <> $2', [email, userId]);
      if (emailRes.rows.length > 0) {
        return res.status(400).json({ message: 'Email đã tồn tại' });
      }

      updates.push(`email = $${paramIndex++}`);
      values.push(email.trim());
    }

    if (typeof phonenumber === 'string' && phonenumber.trim() !== '') {
      const phonePattern = /^0\d{9}$/;
      if (!phonePattern.test(phonenumber)) {
        return res.status(400).json({ message: 'Số điện thoại không hợp lệ' });
      }

      const phoneRes = await database.query('SELECT userid FROM users WHERE phonenumber = $1 AND userid <> $2', [phonenumber, userId]);
      if (phoneRes.rows.length > 0) {
        return res.status(400).json({ message: 'Số điện thoại đã tồn tại' });
      }

      updates.push(`phonenumber = $${paramIndex++}`);
      values.push(phonenumber.trim());
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'Không có thông tin nào để cập nhật' });
    }

    // Thêm userid vào cuối
    values.push(userId);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE userid = $${paramIndex}`;
    await database.query(query, values);

    return res.status(200).json({ message: 'Cập nhật thông tin người dùng thành công' });

  } catch (error) {
    console.error('Lỗi cập nhật thông tin người dùng:', error);
    return res.status(500).json({ error: 'Lỗi server nội bộ' });
  }
};


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
    let paramIndex = 1; // Chỉ số tham số bắt đầu từ 1

    if (title !== null && title !== "") {
      updates.push("title = $" + paramIndex);
      values.push(title);
      paramIndex++;
    }
    if (personal_website !== null && personal_website !== "") {
      updates.push("personal_website = $" + paramIndex);
      values.push(personal_website);
      paramIndex++;
    }
    if (cv_url !== null && cv_url !== "") {
      updates.push("cv_url = $" + paramIndex);
      values.push(cv_url);
      paramIndex++;
    }
    if (field_id !== null && field_id !== "") {
      updates.push("field_id = $" + paramIndex);
      values.push(field_id);
      paramIndex++;
    }

    // Chuyển skills thành mảng PostgreSQL hợp lệ nếu cần
    if (skills !== null && skills !== "") {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      updates.push("skills = $" + paramIndex);
      values.push(`{${skillsArray.join(',')}}`);
      paramIndex++;
    }

    if (introduce !== null && introduce !== "") {
      updates.push("introduce = $" + paramIndex);
      values.push(introduce);
      paramIndex++;
    }

    // Kiểm tra xem người dùng có user_profile không
    const checkUserProfile = await database.query('SELECT * FROM user_profile WHERE userid = $1', [userId]);

    if (checkUserProfile.rows.length > 0) {
      // Nếu có user_profile, thực hiện cập nhật
      values.push(userId); // Thêm userId vào cuối danh sách values
      const query = `UPDATE user_profile SET ${updates.join(', ')} WHERE userid = $${paramIndex}`;
      await database.query(query, values);
      return res.status(200).json({ message: "Cập nhật CV thành công" });
    } else {
      // Nếu không có user_profile, thực hiện thêm mới
      const insertQuery = `INSERT INTO user_profile (userid, ${updates.map((update, index) => update.split('=')[0]).join(', ')}) 
                          VALUES ($1, ${updates.map((_, index) => `$${index + 2}`).join(', ')})`;
      values.unshift(userId); // Đưa userId vào đầu danh sách values
      await database.query(insertQuery, values);
      return res.status(201).json({ message: "Thêm mới CV thành công" });
    }
    
  } catch (error) {
    console.error("Lỗi cập nhật CV:", error);
    return res.status(500).json({ error: "Lỗi server nội bộ" });
  }
};




export { getUsers, getUserById, getCurrentUser, updateProfile, updatePassword, updateCV };
