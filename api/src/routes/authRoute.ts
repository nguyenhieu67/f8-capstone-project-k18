import express from "express";

import { authController } from "@/controllers";
import { RefreshTokenCreateDto, UserCreateDto } from "@/dtos";
import { authRequired } from "@/middlewares";
import { ValidationPipe } from "@/validations";

const router = express.Router();

router.post("/register", ValidationPipe(UserCreateDto), authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", ValidationPipe(RefreshTokenCreateDto), authController.refreshToken);
router.get("/me", authRequired, authController.getCurrentUser);

/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
 *         refreshToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
 *     RegisterInput:
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
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: "nguyenvana@gmail.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "MatKhau123!"
 *
 * /auth/register:
 *   post:
 *     summary: Tạo người dùng mới
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *
 * /auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *
 * /auth/refresh-token:
 *   post:
 *     summary: Tạo access và refresh token mới
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: ""
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *
 * /auth/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 */

export default router;
