import { createAccessToken } from "../config/jwt.js";
import database from "../config/database.js";
import bcrypt from "bcrypt";
import crypto from 'crypto'
import transporter from "../config/mailer.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001";

const avatarURL = 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg';

const signup = async (req, res) => {
  try {
    const { username, password, confirmPassword, email, phone } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const existingUserResult = await database.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUserResult.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Username or Email already exists." });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await database.query(
      `INSERT INTO users (
        username, password, email, phonenumber, avatarurl
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING userid`,
      [
        username, hashedPassword, email, phone, avatarURL
      ]
    );

    const userId = result.rows[0].userid;

    return res
      .status(201)
      .json({ message: "User registered successfully!", userId });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(username, password);
  
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const result = await database.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "User don't exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const payload = {
      userid: user.userid,
      username: user.username,
      role: user.role
    };

    const accessToken = createAccessToken(payload);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: true,
    });

    console.log(user);

    return res.status(200).json({
      message: "Đăng nhập thành công",
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

// quên mật khẩu

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Kiểm tra user có tồn tại
    const result = await database.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "Chúng tôi sẽ gửi link reset password nếu tài khoản được liên kết với email đã được tạo." }); 
    }

    // Tạo token reset
    const token = crypto.randomBytes(32).toString('hex');
    console.log(token)
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 phút

    // Lưu token vào bảng password_resets
    await database.query(`
      INSERT INTO password_resets(email, token, expires_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO UPDATE
      SET token = $2, expires_at = $3
    `, [email, token, expires]);

    // TODO: Gửi mail
    const resetLink = `${FRONTEND_URL}/reset-password/${token}`;
    console.log(resetLink)

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: result.rows[0].email, 
      subject: 'Skill Link: Yêu cầu đặt lại mật khẩu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333;">🔐 Yêu cầu đặt lại mật khẩu</h2>
          <p style="font-size: 16px; color: #555;">
            Xin chào! Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.
          </p>
          <p style="font-size: 16px; color: #555;">
            Nhấn vào nút bên dưới để đặt lại mật khẩu:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
              Đặt lại mật khẩu
            </a>
          </div>
          <p style="font-size: 14px; color: #999;">
            Nếu bạn không yêu cầu, vui lòng bỏ qua email này. Liên kết sẽ hết hạn trong <strong>30 phút</strong>.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin-top: 30px;">
          <p style="font-size: 12px; color: #aaa; text-align: center;">
            © 2025 Skill Link
          </p>
        </div>
      `
    });
    res.json({ message: "Chúng tôi sẽ gửi link reset password nếu tài khoản được liên kết với email đã được tạo." });
  } catch (error){
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
}

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    // Kiểm tra token còn hiệu lực
    const result = await database.query(`
      SELECT email FROM password_resets WHERE token = $1 AND expires_at > NOW()
    `, [token]);
    console.log(token)
    console.log(result)
      
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Token không hợp lệ hoặc đã hết hạn." });
    }

    const email = result.rows[0].email;

    // Băm mật khẩu mới
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cập nhật vào bảng users
    await database.query(`UPDATE users SET password = $1 WHERE email = $2`, [
      hashedPassword,
      email
    ]);

    // Xóa token
    await database.query(`DELETE FROM password_resets WHERE email = $1`, [email]);

    res.json({ message: "Đặt lại mật khẩu thành công." });

  } catch (error){
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
}

export { login, signup, forgotPassword, resetPassword };
