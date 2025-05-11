import database from "../config/database.js";

const getUser = async (req, res) => {
  try {
    const result = await database.query('SELECT * FROM users');
    console.log("Users:", result.rows);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try 
  {
    const { id } = req.params;
    const result = await database.query('SELECT * FROM users WHERE userid = $1', [parseInt(id)]);
    const user = result.rows[0];
    return res.status(200).json(user || {});
  } 
  catch (error) 
  {
    console.error("Get user by id error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getUser, getUserById };
