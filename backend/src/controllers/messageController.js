import database from "../config/database.js";

// Lấy tất cả tin nhắn trong một cuộc hội thoại
const getMessages =  async (req, res) => {
    try {
        const { conversationID } = req.params;
    
        const [Messages] = await database.query(
            `SELECT * FROM Messages WHERE ConversationID = ? ORDER BY CreatedAt ASC`, 
            [conversationID]
        );

        res.status(200).json(Messages);
    } catch (error) {
        console.error("Error fetching messages: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Lấy những tin nhắn gần đây nhất của tất cả cuộc hội thoại (tên người gửi + tin nhắn)
const getLastestMessages = async (req, res) => {
    try {
        const userID = req.userId; // lấy id của user hiện tại

        const [messages] = await database.query(
            `SELECT 
                m.ConversationID,
                m.Content AS LastMessage,
                m.CreatedAt,
                u.UserID AS SenderID,
                u.Username AS SenderName
            FROM Messages m
            JOIN (
                SELECT ConversationID AS ConID, MAX(CreatedAt) AS LatestMessageTime
                FROM Messages
                GROUP BY ConID
            ) latest 
                ON m.ConversationID = latest.ConID 
                AND m.CreatedAt = latest.LatestMessageTime
            JOIN Users u 
                ON m.SenderID = u.UserID
            WHERE m.ConversationID IN (
                SELECT ConversationID
                FROM Users
                WHERE UserID = ?
            )
            ORDER BY m.CreatedAt DESC`,
            [userID]
        );

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching latest messages: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// gửi tin nhắn
const sendMessage = async (req, res) => {
    try {
        const userID = req.userId; // Extracted from the token
        const { conversationID, content } = req.body;

        if (!conversationID || !content) {
            return res.status(400).json({ message: "Conversation ID and message are required" });
        }

        const [result] = await database.query(
            `INSERT INTO Messages (ConversationID, SenderID, Content, CreatedAt) VALUES (?, ?, ?, NOW())`,
            [conversationID, userID, content]
        );

        const newMessage = {
            id: result.insertId,
            conversationID,
            senderID: userID,
            content,
            createdAt: new Date(),
        };

        res.status(201).json(newMessage);
    } catch (error)
    {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export { getMessages, getLastestMessages, sendMessage }