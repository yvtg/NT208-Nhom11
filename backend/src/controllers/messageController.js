import database from "../config/database.js";

// Lấy tất cả tin nhắn trong một cuộc hội thoại
const getMessages =  async (req, res) => {
    try {
        const { conversationID } = req.params;

        const [Messages] = await database.query(
            `SELECT * FROM Messages WHERE ConversationID = ? ORDER BY CreatedAt ASC`, //TODO: chu y ngay
            [conversationID]
        );

        res.status(200).json(Messages);
    } catch (error) {
        console.error("Error fetching messages: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// gửi tin nhắn
const sendMessage = async (req, res) => {
    try {
        const userID = req.user.id; // Extracted from the token
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

export { getMessages, sendMessage }