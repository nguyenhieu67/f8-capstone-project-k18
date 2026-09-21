import express from "express";

import classAttendanceController from "./ClassAttendanceController";

const router = express.Router();

router.get("/", classAttendanceController.getClassAttendance);

/**
 * @swagger
 * components:
 *   schemas:
 *     ClassAttendanceRow:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: id của student_classe
 *           example: 1
 *         studentId:
 *           type: integer
 *           example: 1
 *         fullName:
 *           type: string
 *           example: Nguyen Van A
 *         phone:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [present, absent]
 *           nullable: true
 *           description: null = ngày này chưa điểm danh học viên này
 *         note:
 *           type: string
 *           nullable: true
 *
 * /class-attendance:
 *   get:
 *     summary: Danh sách học viên đang học của 1 lớp kèm trạng thái điểm danh trong 1 ngày
 *     tags:
 *       - Class Attendance
 *     parameters:
 *       - in: query
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: "2026-09-20"
 *     responses:
 *       200:
 *         description: Danh sách điểm danh của lớp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 classId:
 *                   type: integer
 *                 date:
 *                   type: string
 *                 hasRecords:
 *                   type: boolean
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ClassAttendanceRow'
 *       400:
 *         description: classId hoặc date không hợp lệ
 */

export default router;
