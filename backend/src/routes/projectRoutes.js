import express from 'express';
import { getProjects, createProject, updateProject, deleteProject, getProjectById, getMyProjects, getFields, applyToProject } from '../controllers/projectController.js';
import { middlewareToken } from '../config/jwt.js';

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cấu hình Multer để lưu trữ file CV
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads/cvs'); // đường dẫn tới thư mục lưu CV
        console.log('Multer destination:', uploadPath);
        if (!fs.existsSync(uploadPath)){
            console.log('Upload directory does not exist. Creating...', uploadPath);
            fs.mkdirSync(uploadPath, { recursive: true });
            console.log('Upload directory created.');
        } else {
            console.log('Upload directory already exists.', uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const projectId = req.params.projectID;
        const userId = req.user.userid;
        

        const ext = path.extname(file.originalname);
        const filename = `${projectId}-${userId}-${Date.now()}${ext}`;
        console.log('Multer filename:', filename);
        cb(null, filename);
    }
});

// Filter file để chỉ chấp nhận pdf, doc, docx
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    console.log('Checking file mimetype:', file.mimetype);
    if (allowedTypes.includes(file.mimetype)) {
        console.log('File type allowed.');
        cb(null, true);
    } else {
        console.log('File type disallowed.');
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

const projectRoutes = express.Router();

/**
 * @swagger
 * /api/project/getproject:
 *   get:
 *     summary: Lấy danh sách tất cả dự án
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Trả về danh sách dự án thành công
 */
projectRoutes.get('/getproject', middlewareToken,  getProjects);

/**
 * @swagger
 * /api/project/createproject:
 *   post:
 *     summary: Tạo dự án mới
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectName
 *               - userID
 *             properties:
 *               projectName:
 *                 type: string
 *               description:
 *                 type: string
 *               userID:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo dự án thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
projectRoutes.post('/createproject', middlewareToken, createProject);

/**
 * @swagger
 * /api/project/updateproject/{ProjectID}:
 *   put:
 *     summary: Cập nhật thông tin dự án
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: ProjectID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của dự án
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật dự án thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy dự án
 */
projectRoutes.put('/updateproject/:ProjectID', middlewareToken,  updateProject);

/**
 * @swagger
 * /api/project/deleteproject/{ProjectID}:
 *   delete:
 *     summary: Xóa dự án
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: ProjectID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của dự án
 *     responses:
 *       200:
 *         description: Xóa dự án thành công
 *       404:
 *         description: Không tìm thấy dự án
 */
projectRoutes.delete('/deleteproject/:ProjectID',middlewareToken, deleteProject);

/**
 * @swagger
 * /api/project/getprojectbyid/{ProjectID}:
 *   get:
 *     summary: Lấy thông tin dự án theo ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: ProjectID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của dự án
 *     responses:
 *       200:
 *         description: Trả về thông tin dự án thành công
 *       404:
 *         description: Không tìm thấy dự án
 */
projectRoutes.get('/getprojectbyid/:ProjectID', getProjectById);


/**
 * @swagger
 * /api/project/getmyprojects:
 *   get:
 *     summary: Lấy danh sách dự án của người dùng hiện tại
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         schema:
 *           type: string
 *         required: true
 *         description: owner id
 *     responses:
 *       200:
 *         description: Trả về danh sách dự án của người dùng
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 */
projectRoutes.get('/getmyprojects/:ownerId', middlewareToken, getMyProjects);


/**
 * @swagger
 * /api/project/getfields:
 *   get:
 *     summary: Lấy danh sách tất cả lĩnh vực (fields)
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Trả về danh sách lĩnh vực thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   field_id:
 *                     type: integer
 *                     example: 1
 *                   field_name:
 *                     type: string
 *                     example: Web Development
 *       500:
 *         description: Lỗi khi truy vấn danh sách lĩnh vực
 */
projectRoutes.get('/getfields', getFields)

/**
 * @swagger
 * /api/project/{ProjectID}/apply:
 *   post:
 *     summary: Nộp hồ sơ ứng tuyển cho dự án
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ProjectID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của dự án cần ứng tuyển
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Họ và tên ứng viên
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email ứng viên
 *               phone:
 *                 type: string
 *                 description: Số điện thoại ứng viên
 *               introduction:
 *                 type: string
 *                 description: Thư giới thiệu (tùy chọn)
 *               cvFile:
 *                 type: string
 *                 format: binary
 *                 description: File CV (PDF, DOC, DOCX)
 *     responses:
 *       201:
 *         description: Nộp hồ sơ ứng tuyển thành công
 *       400:
 *         description:"Yêu cầu không hợp lệ (ví dụ: thiếu file CV)"
 *       401:
 *         description: "Không được phép (thiếu hoặc token không hợp lệ)"
 *       500:
 *         description: Lỗi server
 */
projectRoutes.post(
    '/:projectID/apply',
     middlewareToken, 
    (req, res, next) => { // Log Content-Type
        console.log('Request received. Content-Type:', req.headers['content-type']);
        next();
    },
    upload.single('cvFile'),
    (req, res, next) => { 
        console.log('Entering multer error handling middleware...');
        if (req.file) {
            console.log('Multer processed file successfully.', req.file);
        } else {
            console.log('Multer did NOT process file successfully. req.file is undefined.');
        }
        console.log('req.body in error handling middleware:', req.body);
        next();
    },
    applyToProject
);

export default projectRoutes;
