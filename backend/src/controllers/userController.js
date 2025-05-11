import database from "../config/database.js";

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
      'SELECT * FROM users WHERE userid = $1',
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

export { getUsers, getUserById, getCurrentUser };
