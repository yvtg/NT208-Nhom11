import database from "../config/database.js";

const getProjects = async (req, res) => {
  try {
    const result = await database.query(`SELECT 
                                          projectid,
                                          projectname,
                                          uploadeddate,
                                          expireddate,
                                          budget,
                                          description,
                                          status,
                                          field_id,
                                          skills
                                          FROM 
                                          projects
                                        ORDER BY uploadeddate DESC;
                                      `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving projects" });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const { ownerId } = req.params;
    console.log("owner ", ownerId)

    const result = await database.query(
      `SELECT 
        p.projectid,
        p.projectname,
        p.uploadeddate,
        p.expireddate,
        p.budget,
        p.ownerid,
        p.description,
        p.workingtype,
        p.workingplace,
        p.status,
        p.averagerating,
        p.field_id,
        p.skills,
        u.username, 
        u.email,
        u.phonenumber,
        u.avatarurl,
        u.userid
      FROM projects p
      JOIN users u ON p.ownerid = u.userid
      WHERE p.ownerid = $1
      ORDER BY p.uploadeddate DESC
      `,
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
    const result = await database.query(
      ` SELECT p.projectid,
        p.projectname,
        p.uploadeddate,
        p.expireddate,
        p.budget,
        p.ownerid,
        p.description,
        p.workingtype,
        p.workingplace,
        p.status,
        p.averagerating,
        p.field_id,
        p.skills,
        u.username, 
        u.email,
        u.phonenumber,
        u.avatarurl,
        u.userid
        FROM projects p
        JOIN users u ON p.ownerid = u.userid
        WHERE p.projectid = $1
      `, [parseInt(ProjectID)]);
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

    const OwnerID = req.user.userid; // Lấy từ token đã xác thực

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
    const userid = req.user.userid;
    try {
        const {
          projectName,
          expiredDate,
          workingType,
          budget,
          description,
          skills,
        } = req.body;
        
        await database.query(
          `UPDATE projects 
          SET projectName = $1, expiredDate = $2, 
              workingType = $3, budget = $4, description = $5, skills = $6
          WHERE projectid = $7`,
          [projectName, expiredDate, workingType, budget, description, skills,  parseInt(ProjectID)]
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
  const userId = req.user.userid; 
  const role = req.user.role;

  try {
    // Lấy thông tin project
    const project = await database.query(
      'SELECT ownerid FROM projects WHERE projectid = $1',
      [parseInt(ProjectID)]
    );

    if (project.rowCount === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const ownerId = project.rows[0].ownerid;

    // Chỉ cho phép xóa nếu là owner hoặc admin
    if (ownerId !== userId && role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to delete this project" });
    }
    // Xóa project
    await database.query('DELETE FROM projects WHERE projectid = $1', [ProjectID]);

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

const getProjectOwner = async (req, res) => {
  try {
    //TODO:viet query o day
  } catch (error) {
    console.error("Error retrieving project owner:", error);
    res.status(500).json({ message: "Error project owner" });
  }
}

export { getProjects, createProject, updateProject, deleteProject, getProjectById, getMyProjects, getFields };