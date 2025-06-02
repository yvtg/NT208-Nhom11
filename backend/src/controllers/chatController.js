import database from "../config/database.js";

// lấy tất cả cuộc hội thoại + tin nhắn gần nhất của 1 người dùng
const getConversationsWithLatestMessages = async (req, res) => {
  try {
    const userID = req.user.userid;

    // Lấy tất cả cuộc hội thoại có liên quan đến user
    const conversations = await database.query(
      `SELECT * FROM conversations WHERE user1_id = $1 OR user2_id = $1`,
      [userID]
    );

    // Lấy tin nhắn gần nhất cho tất cả ConversationID
    const conversationIDs = conversations.rows.map(c => c.conversationid);
    if (conversationIDs.length === 0) {
      return res.status(200).json([]); // không có cuộc hội thoại nào
    }

    // PostgreSQL sử dụng ANY thay vì IN với mảng
    const latestMessages = await database.query(
      `SELECT 
          m.conversationid,
          m.content AS lastmessage,
          m.createdat AS lastmessagetime,
          u.userid AS senderid,
          u.username AS sendername
        FROM messages m
        JOIN (
            SELECT conversationid, MAX(createdat) AS latestmessagetime
            FROM messages
            WHERE conversationid = ANY($1)
            GROUP BY conversationid
        ) latest ON m.conversationid = latest.conversationid 
                AND m.createdat = latest.latestmessagetime
        JOIN users u ON m.senderid = u.userid`,
      [conversationIDs]
    );

    //  Map message theo conversationID để truy cập nhanh
    const latestMessageMap = {};
    latestMessages.rows.forEach(msg => {
      latestMessageMap[msg.conversationid] = msg;
    });

    // Bổ sung thông tin participant + gắn message gần nhất vào
    const enriched = await Promise.all(conversations.rows.map(async (conversation) => {
      const participantID = conversation.user1_id === userID
        ? conversation.user2_id
        : conversation.user1_id;

      const userRows = await database.query(
        `SELECT username, avatarurl FROM users WHERE userid = $1`,
        [participantID]
      );

      const lastMsg = latestMessageMap[conversation.conversationid];

      return {
        ...conversation,
        conversationname: userRows.rows[0]?.username || "Cuộc trò chuyện",
        avatarurl: userRows.rows[0]?.avatarurl || null,
        lastmessage: lastMsg?.lastmessage || "",
        lastmessagetime: lastMsg?.lastmessagetime || null,
        sendername: lastMsg?.sendername || "",
        senderid: lastMsg?.senderid || null,
      };
    }));

    // sắp xếp các cuộc hội thoại gần đây nhất
    enriched.sort((a, b) => {
      const timeA = a.lastmessagetime ? new Date(a.lastmessagetime).getTime() : 0;
      const timeB = b.lastmessagetime ? new Date(b.lastmessagetime).getTime() : 0;
      return timeB - timeA;
    });

    res.status(200).json(enriched);
  } catch (error) {
    console.error("Error fetching conversations with latest messages: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// tạo cuộc hội thoại mới
const createConversation = async (req, res) => {
  try {
    const userID = req.user.userid; // lấy user id từ token
    const { participantID } = req.body;

    if (!participantID) {
      return res.status(400).json({ message: "Participant ID is required" });
    }

    // Kiểm tra xem cuộc hội thoại đã tồn tại chưa
    const existingConversation = await database.query(
      `SELECT * FROM conversations WHERE 
      (user1_id = $1 AND user2_id = $2) OR 
      (user1_id = $2 AND user2_id = $1)`,
      [userID, participantID]
    );

    if (existingConversation.rows.length > 0) {
      const otherID = existingConversation.rows[0].user1_id === userID
        ? existingConversation.rows[0].user2_id
        : existingConversation.rows[0].user1_id;

      const userRows = await database.query(
        `SELECT username, avatarurl FROM users WHERE userid = $1`,
        [otherID]
      );

      return res.status(200).json({
        ...existingConversation.rows[0],
        conversationname: userRows.rows[0]?.username || "Cuộc trò chuyện",
        avatarurl: userRows.rows[0]?.avatarurl || null
      });
    }

    // Tạo cuộc hội thoại mới
    const result = await database.query(
      `INSERT INTO conversations (user1_id, user2_id, createdat) 
      VALUES ($1, $2, NOW()) RETURNING conversationid`,
      [userID, participantID]
    );

    const userRows = await database.query(
      `SELECT username, avatarurl FROM users WHERE userid = $1`,
      [participantID]
    );

    const newConversation = {
      conversationid: result.rows[0].conversationid,
      user1_id: userID,
      user2_id: participantID,
      createdat: new Date(),
      conversationname: userRows.rows[0]?.username || "Cuộc trò chuyện",
      avatarurl: userRows.rows[0]?.avatarurl || null
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
    const currentUserID = req.user.userid;

    if (!conversationID) {
      return res.status(400).json({ message: "Missing conversation ID" });
    }

    // Lấy cuộc hội thoại từ database
    const conversationResult = await database.query(
      `SELECT * FROM conversations WHERE conversationid = $1`,
      [conversationID]
    );

    // kiểm tra cuộc hội thoại có tồn tại khồng
    if (conversationResult.rows.length === 0) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const conversation = conversationResult.rows[0];

    // Kiểm tra quyền: chỉ người trong cuộc mới được xóa
    const isParticipant =
      conversation.user1_id === currentUserID || conversation.user2_id === currentUserID;

    if (!isParticipant) {
      return res.status(403).json({ message: "You are not part of this conversation" });
    }

    // Xóa cuộc hội thoại
    await database.query(`DELETE FROM conversations WHERE conversationid = $1`, [conversationID]);

    // Xóa luôn các tin nhắn liên quan
    await database.query(`DELETE FROM messages WHERE conversationid = $1`, [conversationID]);

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getConversationsWithLatestMessages, createConversation, deleteConversation }