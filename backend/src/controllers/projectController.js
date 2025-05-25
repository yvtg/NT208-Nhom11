import database from "../config/database.js";

const getProjects = async (req, res) => {
  try {
    const result = await database.query('SELECT * FROM projects');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving projects" });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const ownerId = req.userId; // Lấy từ JWT đã xác thực qua middleware

    const result = await database.query(
      'SELECT * FROM projects WHERE ownerid = $1 ORDER BY uploadeddate DESC',
      [ownerId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting user projects:", error);
    res.status(500).json({ message: "Error retrieving user projects" });
  }
};

const getProjectById = async (req, res) => {
  const { ProjectID } = req.params;
  try {
    const result = await database.query('SELECT * FROM projects WHERE projectid = $1', [parseInt(ProjectID)]);
    const project = result.rows[0];
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving project" });
  }
};

const createProject = async (req, res) => {
  try {
    const {
      projectName,
      field,
      skills, // array
      expiredDate,
      workingType,
      workingPlace,
      budget,
      description,
    } = req.body;

    const OwnerID = req.userId; // Lấy từ token đã xác thực

    const result = await database.query(
      `INSERT INTO projects (
        projectName, field_id, skills, expiredDate, workingType, 
        workingPlace, budget, description, ownerid, uploadeddate, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), 'open')
      RETURNING projectid`,
      [projectName, field, skills, new Date(expiredDate), workingType, workingPlace, budget, description, OwnerID]
    );

    const newProject = {
      projectid: result.rows[0].project_id,
      projectName: projectName,
      field_id: field,
      skills: skills,
      expiredDate: expiredDate,
      workingType: workingType,
      workingPlace: workingPlace,
      budget: budget,
      description: description,
      ownerid: OwnerID
    };

    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating project" });
  }
};

const updateProject = async (req, res) => {
    const { ProjectID } = req.params;
    try {
        const {
        projectName,
        field,
        expiredDate,
        workingType,
        budget,
        description,
        } = req.body;
        
        await database.query(
          `UPDATE projects 
           SET projectName = $1, field_id = $2, expiredDate = $3, 
               workingType = $4, budget = $5, description = $6
           WHERE projectid = $7`,
          [projectName, field, expiredDate, workingType, budget, description, parseInt(ProjectID)]
        );
        
        const result = await database.query('SELECT * FROM projects WHERE projectid = $1', [parseInt(ProjectID)]);
        const updatedProject = result.rows[0];
        
        res.status(200).json(updatedProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating project" });
    }
}

const deleteProject = async (req, res) => {
  const { ProjectID } = req.params;
  try {
    await database.query('DELETE FROM projects WHERE projectid = $1', [parseInt(ProjectID)]);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting project" });
  }
};

const getFields = async (req, res) => {
  try {
    const result = await database.query("SELECT field_id, field_name FROM fields ORDER BY field_name ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving fields:", error);
    res.status(500).json({ message: "Error retrieving fields" });
  }
};

export { getProjects, createProject, updateProject, deleteProject, getProjectById, getMyProjects, getFields };