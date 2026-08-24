import express from "express";

import sourceController from "./SourceController";
import { SourceCreateDto, SourceUpdateDto } from "./SourceDto";
import { ValidationPipe } from "@/validations";

const router = express.Router();

router.get("/", sourceController.getList);
router.get("/:id", sourceController.getOne);
router.post("/", ValidationPipe(SourceCreateDto), sourceController.create);
router.put("/:id", ValidationPipe(SourceUpdateDto), sourceController.update);
router.delete("/:id", sourceController.delete);

/**
 * @swagger
 * components:
 *   schemas:
 *     Source:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "0197e2f7-0c7b-7d9d-a8d6-7d0b8b7d1234"
 *         name:
 *           type: string
 *           example: "Facebook Ads"
 *         color:
 *           type: string
 *           example: "#1877F2"
 *         icon:
 *           type: string
 *           example: "facebook"
 *     SourceInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Facebook Ads"
 *         color:
 *           type: string
 *           example: "#1877F2"
 *         icon:
 *           type: string
 *           example: "facebook"
 *
 * /sources:
 *   get:
 *     summary: Lấy danh sách khoá học
 *     tags:
 *       - Sources
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Source'
 *   post:
 *     summary: Tạo khoá học mới
 *     tags:
 *       - Sources
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SourceInput'
 *     responses:
 *       200:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Source'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *
 * /sources/{id}:
 *   get:
 *     summary: Lấy thông tin khoá học theo id
 *     tags:
 *       - Sources
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
 *               $ref: '#/components/schemas/Source'
 *       404:
 *         description: Không tìm thấy khoá học
 *   put:
 *     summary: Sửa khoá học
 *     tags:
 *       - Sources
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
 *             $ref: '#/components/schemas/SourceInput'
 *     responses:
 *       200:
 *         description: Sửa thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Source'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy khoá học
 *   delete:
 *     summary: Xoá khoá học
 *     tags:
 *       - Sources
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
 *         description: Không tìm thấy khoá học
 */

export default router;
