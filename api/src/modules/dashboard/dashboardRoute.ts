import express from "express";

import dashboardController from "./DashboardController";

const router = express.Router();

router.get("/", dashboardController.getDashboard);

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Số liệu tổng quan Dashboard theo tháng
 *     tags:
 *       - Dashboard
 *     parameters:
 *       - in: query
 *         name: month
 *         required: false
 *         description: Kỳ báo cáo dạng YYYY-MM. Mặc định là tháng hiện tại.
 *         schema:
 *           type: string
 *           example: "2026-09"
 *     responses:
 *       200:
 *         description: Doanh thu, leads, học viên, quỹ lương, bảng xếp hạng Sales, lý do từ chối phổ biến
 *       400:
 *         description: month không đúng định dạng
 */

export default router;
