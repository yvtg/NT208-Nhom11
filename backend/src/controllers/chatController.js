import database from "../config/database.js";

// lấy tất cả cuộc hội thoại của 1 người dùng
const getConversations = async (req, res) => {
    try {
        const userID = req.userId; // Extracted from the token
        console.log("User ID:", userID);
        const [conversations] = await database.query(
            `SELECT * FROM Conversations WHERE User1_ID = ? OR User2_ID = ?`,
            [userID, userID]
        );
        console.log("Conversations:", conversations);
        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error fetching conversations: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// tạo cuộc hội thoại mới
const createConversation = async (req, res) => {
  try {
    const userID = req.userId; // Extracted from the token
    const { participantID } = req.body;

    if (!participantID) {
      return res.status(400).json({ message: "Participant ID is required" });
    }

    // Kiểm tra xem cuộc hội thoại đã tồn tại chưa
    const [existingConversation] = await database.query(
      `SELECT * FROM Conversations WHERE 
      (User1_ID = ? AND User2_ID = ?) OR 
      (User1_ID = ? AND User2_ID = ?)`,
      [userID, participantID, participantID, userID]
    );

    if (existingConversation.length > 0) {
      return res.status(200).json(existingConversation[0]);
    }

    // Tạo cuộc hội thoại mới
    const [result] = await database.query(
      `INSERT INTO Conversations (User1_ID, User2_ID, CreatedAt) VALUES (?, ?, NOW())`,
      [userID, participantID]
    );

    const newConversation = {
      id: result.insertId,
      User1_ID: userID,
      User2_ID: participantID,
      CreatedAt: new Date(),
    };

    res.status(201).json(newConversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export { getConversations, createConversation }