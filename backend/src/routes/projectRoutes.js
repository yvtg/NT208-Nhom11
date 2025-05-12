import express from 'express';
import { getProjects, createProject, updateProject, deleteProject, getProjectById } from '../controllers/projectController.js';

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
projectRoutes.get('/getproject', getProjects);

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
projectRoutes.post('/createproject', createProject);

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
projectRoutes.put('/updateproject/:ProjectID', updateProject);

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
projectRoutes.delete('/deleteproject/:ProjectID', deleteProject);

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

export default projectRoutes;
