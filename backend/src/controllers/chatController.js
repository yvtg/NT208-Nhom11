import database from "../config/database.js";

// lấy tất cả cuộc hội thoại + tin nhắn gần nhất của 1 người dùng
const getConversationsWithLatestMessages = async (req, res) => {
  try {
    const userID = req.userId;

    // Lấy tất cả cuộc hội thoại có liên quan đến user
    const [conversations] = await database.query(
      `SELECT * FROM Conversations WHERE User1_ID = ? OR User2_ID = ?`,
      [userID, userID]
    );

    // Lấy tin nhắn gần nhất cho tất cả ConversationID
    const conversationIDs = conversations.map(c => c.ConversationID);
    if (conversationIDs.length === 0) {
      return res.status(200).json([]); // không có cuộc hội thoại nào
    }

    const [latestMessages] = await database.query(
      `SELECT 
          m.ConversationID,
          m.Content AS LastMessage,
          m.CreatedAt AS LastMessageTime,
          u.UserID AS SenderID,
          u.Username AS SenderName
        FROM Messages m
        JOIN (
            SELECT ConversationID, MAX(CreatedAt) AS LatestMessageTime
            FROM Messages
            WHERE ConversationID IN (?)
            GROUP BY ConversationID
        ) latest ON m.ConversationID = latest.ConversationID 
                AND m.CreatedAt = latest.LatestMessageTime
        JOIN Users u ON m.SenderID = u.UserID`,
      [conversationIDs]
    );

    //  Map message theo conversationID để truy cập nhanh
    const latestMessageMap = {};
    latestMessages.forEach(msg => {
      latestMessageMap[msg.ConversationID] = msg;
    });

    // Bổ sung thông tin participant + gắn message gần nhất vào
    const enriched = await Promise.all(conversations.map(async (conversation) => {
      const participantID = conversation.User1_ID === userID
        ? conversation.User2_ID
        : conversation.User1_ID;

      const [userRows] = await database.query(
        `SELECT Username, AvatarURL FROM Users WHERE UserID = ?`,
        [participantID]
      );

      const lastMsg = latestMessageMap[conversation.ConversationID];

      return {
        ...conversation,
        ConversationName: userRows[0]?.Username || "Cuộc trò chuyện",
        AvatarURL: userRows[0]?.AvatarURL || null,
        LastMessage: lastMsg?.LastMessage || "",
        LastMessageTime: lastMsg?.LastMessageTime || null,
        SenderName: lastMsg?.SenderName || "",
        SenderID: lastMsg?.SenderID || null,
      };
    }));

    res.status(200).json(enriched);
  } catch (error) {
    console.error("Error fetching conversations with latest messages: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// tạo cuộc hội thoại mới
const createConversation = async (req, res) => {
  try {
    const userID = req.userId; // lấy user id từ token
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
      const otherID = existingConversation[0].User1_ID === userID
        ? existingConversation[0].User2_ID
        : existingConversation[0].User1_ID;

      const [userRows] = await database.query(
        `SELECT Username, AvatarURL FROM Users WHERE UserID = ?`,
        [otherID]
      );

      return res.status(200).json({
        ...existingConversation[0],
        ConversationName: userRows[0]?.Username || "Cuộc trò chuyện",
        AvatarURL: userRows[0]?.AvatarURL || null
      });
    }

    // Tạo cuộc hội thoại mới
    const [result] = await database.query(
      `INSERT INTO Conversations (User1_ID, User2_ID, CreatedAt) VALUES (?, ?, NOW())`,
      [userID, participantID]
    );

    const [userRows] = await database.query(
      `SELECT Username, AvatarURL FROM Users WHERE UserID = ?`,
      [participantID]
    );

    const newConversation = {
      ConversationID: result.insertId,
      User1_ID: userID,
      User2_ID: participantID,
      CreatedAt: new Date(),
      ConversationName: userRows[0]?.Username || "Cuộc trò chuyện",
      AvatarURL: userRows[0]?.AvatarURL || null
    };

    res.status(201).json(newConversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// xóa cuộc hội thoại theo conversationID
const deleteConversation = async (req, res) => {
  try {
    const conversationID = req.params.conversationID;
    const currentUserID = req.userId; 

    if (!conversationID) {
      return res.status(400).json({ message: "Missing conversation ID" });
    }

    // Lấy cuộc hội thoại từ database
    const [conversationResult] = await database.query(
      `SELECT * FROM Conversations WHERE ConversationID = ?`,
      [conversationID]
    );

    // kiểm tra cuộc hội thoại có tồn tại khồng
    if (conversationResult.length === 0) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const conversation = conversationResult[0];

    // Kiểm tra quyền: chỉ người trong cuộc mới được xóa
    const isParticipant =
      conversation.User1_ID === currentUserID || conversation.User2_ID === currentUserID;

    if (!isParticipant) {
      return res.status(403).json({ message: "You are not part of this conversation" });
    }

    // Xóa cuộc hội thoại
    await database.query(`DELETE FROM Conversations WHERE ConversationID = ?`, [conversationID]);

    // Xóa luôn các tin nhắn liên quan
    await database.query(`DELETE FROM Messages WHERE ConversationID = ?`, [conversationID]);

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export { getConversationsWithLatestMessages, createConversation, deleteConversation }