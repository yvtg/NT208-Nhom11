import express from 'express';
import { getProjects, createProject, updateProject, deleteProject, getProjectById, getMyProjects, getFields } from '../controllers/projectController.js';
import { middlewareToken } from '../config/jwt.js';
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

export default projectRoutes;
