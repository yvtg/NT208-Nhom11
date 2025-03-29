import database from "../config/database.js";

const getUser = async (req, res) => {
  try {
    const [users] = await database.query('SELECT * FROM Users');
    return res.status(200).json(users);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try 
  {
    const { id } = req.params;
    const [rows] = await database.query('SELECT * FROM Users WHERE UserID = ?', [parseInt(id)]);
    const user = rows[0];
    return res.status(200).json(user || {});
  } 
  catch (error) 
  {
    console.error("Get user by id error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserByIdQuery = async (req, res) => {
  try 
  {
    const { id } = req.query;
    const [rows] = await database.query('SELECT * FROM Users WHERE UserID = ?', [parseInt(id)]);
    const user = rows[0];
    return res.status(200).json(user || {});
  } 
  catch (error) 
  {
    console.error("Get user by id error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getUser, getUserById, getUserByIdQuery };
