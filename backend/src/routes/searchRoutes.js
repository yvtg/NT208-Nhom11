import express from 'express';
import { middlewareToken } from '../config/jwt.js';
import { searchProject } from '../controllers/searchController.js'

const searchRoutes = express.Router();

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Tìm kiếm các project với full-text search và bộ lọc nâng cao
 *     description: Trả về danh sách các project phù hợp dựa trên tên, mô tả, ngày tạo, ngày hết hạn, kỹ năng, loại công việc,...
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm chính"
 *     responses:
 *       200:
 *         description: Danh sách các project phù hợp
 */
searchRoutes.get('/search', middlewareToken, searchProject);

export default searchRoutes;