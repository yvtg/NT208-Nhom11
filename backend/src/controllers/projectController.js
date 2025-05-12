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
      ProjectName,
      Field,
      ExpiredDate,
      WorkingType,
      Budget,
      Description,
    } = req.body;

    const OwnerID = req.userId; // Lấy từ token đã xác thực

    const result = await database.query(
      `INSERT INTO projects (
        projectname, field_id, expireddate, workingtype, 
        budget, description, ownerid, uploadeddate, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), 'open')
      RETURNING projectid`,
      [ProjectName, Field, new Date(ExpiredDate), WorkingType, Budget, Description, OwnerID]
    );

    const newProject = {
      projectid: result.rows[0].project_id,
      projectname: ProjectName,
      field_id: Field,
      expireddate: ExpiredDate,
      workingtype: WorkingType,
      budget: Budget,
      description: Description,
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
        ProjectName,
        Field,
        ExpiredDate,
        WorkingType,
        Budget,
        Description,
        } = req.body;
        
        await database.query(
          `UPDATE projects 
           SET projectname = $1, field_id = $2, expireddate = $3, 
               workingtype = $4, budget = $5, description = $6
           WHERE projectid = $7`,
          [ProjectName, Field, ExpiredDate, WorkingType, Budget, Description, parseInt(ProjectID)]
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