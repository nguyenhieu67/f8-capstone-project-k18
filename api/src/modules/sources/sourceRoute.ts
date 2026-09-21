import express from "express";

import sourceController from "./SourceController";
import { SourceCreateDto, SourceUpdateDto } from "./SourceDto";
import { ValidationPipe } from "@/validations";

const router = express.Router();

router.get("/", sourceController.getList);
router.get("/stats", sourceController.getStats);
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
 *     summary: Lấy danh sách nguồn quảng cáo
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
 *     summary: Tạo nguồn quảng cáo mới
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
 * /sources/stats:
 *   get:
 *     summary: Danh sách nguồn quảng cáo kèm số liệu (số lead, học viên đã chốt đơn, doanh thu)
 *     description: |
 *       - leadsCount: số lead mang về (mọi trạng thái)
 *       - convertedCount: số học viên đã chốt đơn đến từ nguồn
 *       - revenue: tổng học phí các đăng ký lớp của những học viên đó (1 học viên học nhiều lớp thì cộng đủ)
 *     tags:
 *       - Sources
 *     responses:
 *       200:
 *         description: Lấy thống kê thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       color:
 *                         type: string
 *                       icon:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [active, inactive]
 *                       leadsCount:
 *                         type: integer
 *                       convertedCount:
 *                         type: integer
 *                       revenue:
 *                         type: integer
 *                 total:
 *                   type: integer
 *
 * /sources/{id}:
 *   get:
 *     summary: Lấy thông tin nguồn quảng cáo theo id
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
 *         description: Không tìm thấy nguồn quảng cáo
 *   put:
 *     summary: Sửa nguồn quảng cáo
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
 *         description: Không tìm thấy nguồn quảng cáo
 *   delete:
 *     summary: Xoá nguồn quảng cáo
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
 *         description: Không tìm thấy nguồn quảng cáo
 */

export default router;
