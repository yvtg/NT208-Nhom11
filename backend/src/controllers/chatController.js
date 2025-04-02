import database from "../config/database.js";

const getConversations = (req, res) => {
    const userId = req.user.id;
    database.query(`
        SELECT * FROM conversations 
        WHERE User1_ID = ? OR User2_ID = ?`, [userId, userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

const createConversation = (req, res) => {
    const { receiver_id } = req.body;
    const userId = req.user.id;

    database.query(`SELECT * FROM conversations WHERE 
        (User1_ID = ? AND User2_ID = ?) OR 
        (User1_ID = ? AND User2_ID = ?)`, 
        [userId, receiver_id, receiver_id, userId], (err, results) => {
        
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            return res.json(results[0]); 
        }

        database.query("INSERT INTO conversations (user1_id, user2_id) VALUES (?, ?)", 
        [userId, receiver_id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId });
        });
    });
};

export { getConversations, createConversation }