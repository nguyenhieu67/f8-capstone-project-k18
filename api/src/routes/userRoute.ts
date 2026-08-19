import express from "express";

import { userController } from "@/controllers";
import { UserUpdateDto } from "@/dtos";
import { ValidationPipe } from "@/validations";

const router = express.Router();

router.get("/", userController.getList);
router.get("/:id", userController.getOne);
router.put("/:id", ValidationPipe(UserUpdateDto), userController.update);
router.delete("/:id", userController.delete);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: "nguyenvana@gmail.com"
 *         first_name:
 *           type: string
 *           example: "Nguyen"
 *         last_name:
 *           type: string
 *           example: "Van A"
 *         role:
 *           type: string
 *           enum: [admin, guest, authorized]
 *           example: "guest"
 *         phone:
 *           type: string
 *           example: "0912345678"
 *         avatar_url:
 *           type: string
 *           example: "https://example.com/avatar.jpg"
 *         last_login_at:
 *           type: string
 *           format: date-time
 *           example: "2026-08-18T10:00:00Z"
 *     UserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - first_name
 *         - last_name
 *       properties:
 *         email:
 *           type: string
 *           example: "nguyenvana@gmail.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "MatKhau123!"
 *         first_name:
 *           type: string
 *           example: "Nguyen"
 *         last_name:
 *           type: string
 *           example: "Van A"
 *         role:
 *           type: string
 *           enum: [admin, guest, authorized]
 *           example: "guest"
 *         phone:
 *           type: string
 *           example: "0912345678"
 *
 * /users:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 * /users/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo id
 *     tags:
 *       - Users
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
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Không tìm thấy người dùng
 *   put:
 *     summary: Sửa thông tin người dùng
 *     tags:
 *       - Users
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
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Sửa thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 *   delete:
 *     summary: Xoá người dùng
 *     tags:
 *       - Users
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
 *         description: Không tìm thấy người dùng
 */

export default router;
