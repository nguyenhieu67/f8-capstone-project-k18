import express from "express";

import payrollController from "./PayrollController";

const router = express.Router();

router.get("/", payrollController.getMonthlyPayroll);

/**
 * @swagger
 * components:
 *   schemas:
 *     PayrollRow:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         fullName:
 *           type: string
 *           example: Nguyen Van A
 *         role:
 *           type: string
 *           enum: [trainer, sale, assistant, manager, admin]
 *         baseSalary:
 *           type: integer
 *           example: 10000000
 *         absentDeduction:
 *           type: integer
 *           example: 0
 *         salesVolume:
 *           type: integer
 *           example: 100000000
 *         commissionRate:
 *           type: integer
 *           example: 3
 *         commission:
 *           type: integer
 *           example: 3000000
 *         grossIncome:
 *           type: integer
 *           example: 13000000
 *         insuranceTotal:
 *           type: integer
 *           example: 1050000
 *         taxableIncome:
 *           type: integer
 *           example: 0
 *         pitTax:
 *           type: integer
 *           example: 0
 *         netSalary:
 *           type: integer
 *           example: 11950000
 *
 * /payroll:
 *   get:
 *     summary: Bảng lương của tất cả nhân viên theo tháng
 *     tags:
 *       - Payroll
 *     parameters:
 *       - in: query
 *         name: month
 *         required: false
 *         description: Kỳ lương dạng YYYY-MM. Mặc định là tháng hiện tại.
 *         schema:
 *           type: string
 *           example: "2026-09"
 *     responses:
 *       200:
 *         description: Tính lương thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 month:
 *                   type: string
 *                   example: "2026-09"
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PayrollRow'
 *       400:
 *         description: month không đúng định dạng
 */

export default router;
