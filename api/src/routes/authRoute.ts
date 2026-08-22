import express from "express";

import { authController } from "@/controllers";
import { ForgotPasswordDto, ResetPasswordDto, UserCreateDto } from "@/dtos";
import { authRequired } from "@/middlewares";
import { ValidationPipe } from "@/validations";

const router = express.Router();

router.post("/register", ValidationPipe(UserCreateDto), authController.register);
router.post("/login", authController.login);
router.post("/logout", authRequired, authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.post("/forgot-password", ValidationPipe(ForgotPasswordDto), authController.forgotPassword);
router.post("/reset-password", ValidationPipe(ResetPasswordDto), authController.resetPassword);
router.get("/me", authRequired, authController.getCurrentUser);

/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 1
 *         email:
 *           type: string
 *           example: example@gmail.com
 *     RegisterInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *       properties:
 *         email:
 *           type: string
 *           example: "nguyenvana@gmail.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "MatKhau123!"
 *         firstName:
 *           type: string
 *           example: "Nguyen"
 *         lastName:
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
