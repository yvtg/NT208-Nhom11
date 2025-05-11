import { createAccessToken } from "../config/jwt.js";
import database from "../config/database.js";

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
    
    const result = await database.query(
      `INSERT INTO users (
        username, password, email, phonenumber, avatarurl,
        skill, experience, cv_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING userid`,
      [
        username, password, email, phone, avatarURL,
        '', 0, ''
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
    const { Username, Password } = req.body;

    console.log(Username, Password);
  
    if (!Username || !Password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const result = await database.query(
      'SELECT * FROM users WHERE username = $1',
      [Username]
    );
    
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "User don't exist" });
    }

    if (user.password !== Password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const payload = {
      userid: user.userid,
      username: user.username,
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
export { login, signup };
