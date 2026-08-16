import { studentController } from "@/controllers";
import { StudentCreateDto, StudentUpdateDto } from "@/dtos";
import { ValidationPipe } from "@/validations";
import express from "express";

const router = express.Router();

router.get("/", studentController.getList);
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
 *         lead_id:
 *           type: number
 *           example: 1
 *         first_name:
 *           type: string
 *           example: "Nguyen Van"
 *         last_name:
 *           type: string
 *           example: "A"
 *         phone:
 *           type: string
 *           example: "0901234567"
 *         revenue:
 *           type: integer
 *           example: 5000000
 *         enrolled_at:
 *           type: string
 *           format: date-time
 *           example: "2026-08-16T09:00:00Z"
 *     StudentInput:
 *       type: object
 *       required:
 *         - lead_id
 *         - first_name
 *         - last_name
 *       properties:
 *         lead_id:
 *           type: number
 *           example: 1
 *         first_name:
 *           type: string
 *           example: "Nguyen Van"
 *         last_name:
 *           type: string
 *           example: "A"
 *         phone:
 *           type: string
 *           example: "0901234567"
 *         revenue:
 *           type: integer
 *           example: 5000000
 *         enrolled_at:
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
