import connect from '../config/database.js';

// Hàm tạo user mới
export const createUser = async (username, passwordHash, email, phoneNumber, avatarURL, skill, experience, cvURL) => {
    const query = `
        INSERT INTO Users (Username, Password, Email, PhoneNumber, AvartarURL, Skill, Experience, CV_URL)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await connect.execute(query, [
        username, passwordHash, email, phoneNumber, avatarURL, skill, experience, cvURL
    ]);
    return result;
};

// Hàm lấy user theo Email
export const getUserByEmail = async (email) => {
    const query = `SELECT * FROM Users WHERE Email = ?`;
    const [rows] = await connect.execute(query, [email]);
    return rows.length > 0 ? rows[0] : null;
};

// Hàm lấy user theo Username
export const getUserByUsername = async (username) => {
    const query = `SELECT * FROM Users WHERE Username = ?`;
    const [rows] = await connect.execute(query, [username]);
    return rows.length > 0 ? rows[0] : null;
};

// Hàm cập nhật điểm đánh giá (AverageRating)
export const updateUserRating = async (userId, newRating) => {
    const query = `UPDATE Users SET AverageRating = ? WHERE UserID = ?`;
    await connect.execute(query, [newRating, userId]);
};
