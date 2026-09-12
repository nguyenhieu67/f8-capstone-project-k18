import express from "express";

import studentController from "./StudentController";
import studentClasseController from "./studentClasse/StudentClasseController.ts";
import { StudentCreateDto, StudentUpdateDto } from "./StudentDto";
import { ValidationPipe } from "@/validations";
import studentAttendanceController from "./studentAttendance/StudentAttendanceController";

const router = express.Router();

// Student Classe
router.get("/student-classes", studentClasseController.getListByField("classId"));

// Student Attendance
router.get("/student-attendance", studentAttendanceController.getList);
router.post("/student-attendance", studentAttendanceController.saveSessionAttendance);

// Student
router.get("/", studentController.getList);
router.get("/:id", studentController.getOne);
router.post("/", ValidationPipe(StudentCreateDto), studentController.create);
router.put("/:id", ValidationPipe(StudentUpdateDto), studentController.update);
router.delete("/:id", studentController.delete);

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "0197e2f7-0c7b-7d9d-a8d6-7d0b8b7d1234"
 *         leadId:
 *           type: number
 *           example: 1
 *         firstName:
 *           type: string
 *           example: "Nguyen Van"
 *         lastName:
 *           type: string
 *           example: "A"
 *         phone:
 *           type: string
 *           example: "0901234567"
 *         revenue:
 *           type: integer
 *           example: 5000000
 *         enrolledAt:
 *           type: string
 *           format: date-time
 *           example: "2026-08-16T09:00:00Z"
 *     StudentInput:
 *       type: object
 *       required:
 *         - leadId
 *         - firstName
 *         - lastName
 *       properties:
 *         leadId:
 *           type: number
 *           example: 1
 *         firstName:
 *           type: string
 *           example: "Nguyen Van"
 *         lastName:
 *           type: string
 *           example: "A"
 *         phone:
 *           type: string
 *           example: "0901234567"
 *         revenue:
 *           type: integer
 *           example: 5000000
 *         enrolledAt:
 *           type: string
 *           format: date-time
 *           example: "2026-08-16T09:00:00Z"
 *
 * /students:
 *   get:
 *     summary: Lấy danh sách học sinh
 *     tags:
 *       - Students
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *   post:
 *     summary: Tạo học sinh mới
 *     tags:
 *       - Students
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentInput'
 *     responses:
 *       200:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *
 * /students/{id}:
 *   get:
 *     summary: Lấy thông tin học sinh theo id
 *     tags:
 *       - Students
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Không tìm thấy học sinh
 *   put:
 *     summary: Sửa học sinh
 *     tags:
 *       - Students
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentInput'
 *     responses:
 *       200:
 *         description: Sửa thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy học sinh
 *   delete:
 *     summary: Xoá học sinh
 *     tags:
 *       - Students
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Xoá thành công
 *       404:
 *         description: Không tìm thấy học sinh
 */

export default router;
