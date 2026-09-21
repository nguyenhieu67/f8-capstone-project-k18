import express from "express";

import saleResultController from "./SaleResultController";

const router = express.Router();

router.get("/", saleResultController.getSaleResults);

/**
 * @swagger
 * components:
 *   schemas:
 *     SaleResult:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         enrolledAt:
 *           type: string
 *           format: date-time
 *         tuitionAmount:
 *           type: integer
 *           example: 5000000
 *         studentName:
 *           type: string
 *           example: Nguyen Van A
 *         phone:
 *           type: string
 *           nullable: true
 *         sourceName:
 *           type: string
 *           nullable: true
 *         sellerName:
 *           type: string
 *           nullable: true
 *         className:
 *           type: string
 *           nullable: true
 *
 * /sale-results:
 *   get:
 *     summary: Kết quả bán hàng (học viên đã đăng ký lớp) kèm tổng doanh thu
 *     tags:
 *       - Sale Results
 *     parameters:
 *       - in: query
 *         name: month
 *         required: false
 *         description: Lọc theo tháng đăng ký, dạng YYYY-MM. Bỏ trống = tất cả thời gian.
 *         schema:
 *           type: string
 *           example: "2026-09"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Danh sách phân trang; totalRevenue là tổng của toàn bộ kết quả khớp bộ lọc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SaleResult'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalRevenue:
 *                   type: integer
 *       400:
 *         description: month không đúng định dạng
 */

export default router;
