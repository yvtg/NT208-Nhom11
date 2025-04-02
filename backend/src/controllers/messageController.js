import database from "../config/database.js";

const getMessages = (req, res) => {
    const { conversation_id } = req.params;
    database.query("SELECT * FROM messages WHERE ConversationID = ? ORDER BY CreatedAt ASC", 
    [conversation_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

export { getMessages }