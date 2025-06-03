import database from "../config/database.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/cvs')); //tạm thời lưu ở backend 
    },
    filename: function (req, file, cb) {
        const projectId = req.params.projectID;
        const userId = req.user.userid; // Lấy từ middlewareToken
        const ext = path.extname(file.originalname);
        cb(null, `${projectId}-${userId}-${Date.now()}${ext}`);
    }
});

// Filter file để chỉ chấp nhận pdf, doc, docx
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ cho phép tải lên file PDF, DOC, và DOCX!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Giới hạn kích thước file 5MB
    },
    fileFilter: fileFilter
});

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

// Controller function để nộp hồ sơ ứng tuyển
const applyToProject = async (req, res) => {
    try {
        // req.user được set bởi middlewareToken
        const userId = req.user.userid;
        const projectId = req.params.projectID;

        // req.file chứa thông tin file đã upload
        // req.body chứa các trường text khác (fullName, email, phone, introduction)
        const { fullName, email, phone, introduction } = req.body;
        const cvPath = req.file ? `/uploads/cvs/${req.file.filename}` : null; // Lưu đường dẫn tương đối của file

        if (!cvPath) {
            return res.status(400).json({ message: 'Không tìm thấy file CV đã tải lên.' });
        }

        // Lưu thông tin ứng tuyển vào database application 
        const result = await database.query(
            `INSERT INTO applications (
                project_id, user_id, full_name, email, phone, introduction, cv_path
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING application_id`,
            [projectId, userId, fullName, email, phone, introduction, cvPath]
        );

        res.status(201).json({ message: 'Hồ sơ ứng tuyển đã được nộp thành công!', applicationId: result.rows[0].application_id });

    } catch (error) {
        console.error('Lỗi khi nộp hồ sơ:', error);
        // Xóa file đã upload nếu có lỗi xảy ra sau khi upload - Note: fs needs to be imported
        // if (req.file) {
        //     const fs = require('fs');
        //     fs.unlink(req.file.path, (err) => {
        //         if (err) console.error('Lỗi khi xóa file tạm:', err);
        //     });
        // }
        res.status(500).json({ message: 'Đã xảy ra lỗi khi nộp hồ sơ.' });
    }
};

export { getProjects, createProject, updateProject, deleteProject, getProjectById, getMyProjects, getFields, applyToProject };