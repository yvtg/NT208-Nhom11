import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail, getUserByUsername } from '../models/User.js';

// Xử lý đăng ký user
export const register = async (req, res) => {
    try {
        const { username, email, password, phoneNumber, avatarURL, skill, experience, cvURL } = req.body;

        // Kiểm tra username hoặc email đã tồn tại chưa
        const existingUserByEmail = await getUserByEmail(email);
        if (existingUserByEmail) {
            return res.status(400).json({ message: 'Email đã được sử dụng!' });
        }

        const existingUserByUsername = await getUserByUsername(username);
        if (existingUserByUsername) {
            return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại!' });
        }

        // Hash mật khẩu
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Lưu user vào database
        await createUser(username, passwordHash, email, phoneNumber, avatarURL, skill, experience, cvURL);

        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};
