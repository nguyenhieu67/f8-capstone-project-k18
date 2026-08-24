import express from "express";

import classeController from "./ClasseController";
import { ClasseCreateDto, ClasseUpdateDto } from "./ClasseDto";
import { ValidationPipe } from "@/validations";

const router = express.Router();

router.get("/", classeController.getList);
router.get("/:id", classeController.getOne);
router.post("/", ValidationPipe(ClasseCreateDto), classeController.create);
router.put("/:id", ValidationPipe(ClasseUpdateDto), classeController.update);
router.delete("/:id", classeController.delete);

/**
 * @swagger
 * components:
 *   schemas:
 *     Classe:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "0197e2f7-0c7b-7d9d-a8d6-7d0b8b7d1234"
 *         trainerId:
 *           type: number
 *           example: 1
 *         code:
 *           type: string
 *           example: "A BASIC"
 *         name:
 *           type: string
 *           example: "Khoa hoc co ban A"
 *         schedule:
 *           type: string
 *           example: "T2-4-6, 18:00-20:00"
 *         tuition:
 *           type: integer
 *           example: 5000000
 *     ClasseInput:
 *       type: object
 *       required:
 *         - trainerId
 *         - code
 *         - name
 *       properties:
 *         trainerId:
 *           type: number
 *           example: 1
 *         code:
 *           type: string
 *           example: "A BASIC"
 *         name:
 *           type: string
 *           example: "Khoa hoc co ban A"
 *         schedule:
 *           type: string
 *           example: "T2-4-6, 18:00-20:00"
 *         tuition:
 *           type: integer
 *           example: 5000000
 *
 * /classes:
 *   get:
 *     summary: Lấy danh sách lớp học
 *     tags:
 *       - Classes
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Classe'
 *   post:
 *     summary: Tạo lớp học mới
 *     tags:
 *       - Classes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClasseInput'
 *     responses:
 *       200:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Classe'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *
 * /classes/{id}:
 *   get:
 *     summary: Lấy thông tin lớp học theo id
 *     tags:
 *       - Classes
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
 *               $ref: '#/components/schemas/Classe'
 *       404:
 *         description: Không tìm thấy lớp học
 *   put:
 *     summary: Sửa lớp học
 *     tags:
 *       - Classes
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
 *             $ref: '#/components/schemas/ClasseInput'
 *     responses:
 *       200:
 *         description: Sửa thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Classe'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy lớp học
 *   delete:
 *     summary: Xoá lớp học
 *     tags:
 *       - Classes
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
 *         description: Không tìm thấy lớp học
 */

export default router;
