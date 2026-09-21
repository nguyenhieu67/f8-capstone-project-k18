import express from "express";

import leadController from "./LeadController";
import { LeadCreateDto, LeadUpdateDto } from "./LeadDto";
import { ValidationPipe } from "@/validations";

const router = express.Router();

router.get("/", leadController.getList);
router.get("/:id", leadController.getOne);
router.post("/", ValidationPipe(LeadCreateDto), leadController.create);
router.put("/:id", ValidationPipe(LeadUpdateDto), leadController.update);
router.delete("/:id", leadController.delete);

/**
 * @swagger
 * components:
 *   schemas:
 *     Lead:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "0197e2f7-0c7b-7d9d-a8d6-7d0b8b7d1234"
 *         sellerId:
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
 *         purpose:
 *           type: string
 *           example: "Học lập trình cho con"
 *         who:
 *           type: string
 *           example: "Phụ huynh"
 *         status:
 *           type: string
 *           enum: [new, contacted, qualified, converted, lost]
 *           example: new
 *         rejectionReason:
 *           type: string
 *           example: "Không đủ ngân sách"
 *     LeadInput:
 *       type: object
 *       required:
 *         - sellerId
 *         - firstName
 *         - lastName
 *       properties:
 *         sellerId:
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
 *         purpose:
 *           type: string
 *           example: "Học lập trình cho con"
 *         who:
 *           type: string
 *           example: "Phụ huynh"
 *         status:
 *           type: string
 *           enum: [new, contacted, qualified, converted, lost]
 *           example: new
 *         rejectionReason:
 *           type: string
 *           example: "Không đủ ngân sách"
 *
 * /leads:
 *   get:
 *     summary: Lấy danh sách khách hàng tiềm năng
 *     tags:
 *       - Leads
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         description: Lọc theo trạng thái. Bỏ trống = tất cả.
 *         schema:
 *           type: string
 *           enum: [new, contacted, qualified, converted, lost]
 *       - in: query
 *         name: sourceId
 *         required: false
 *         description: Lọc theo nguồn quảng cáo. Bỏ trống = tất cả.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sellerId
 *         required: false
 *         description: Lọc theo seller phụ trách. Bỏ trống = tất cả.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         required: false
 *         description: Tìm theo tên hoặc SĐT khách hàng (không phân biệt hoa thường và dấu tiếng Việt). Tối đa 100 ký tự.
 *         schema:
 *           type: string
 *           example: nguyen van
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lead'
 *   post:
 *     summary: Tạo khách hàng tiềm năng mới
 *     tags:
 *       - Leads
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeadInput'
 *     responses:
 *       200:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lead'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *
 * /leads/{id}:
 *   get:
 *     summary: Lấy thông tin khách hàng tiềm năng theo id
 *     tags:
 *       - Leads
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
 *               $ref: '#/components/schemas/Lead'
 *       404:
 *         description: Không tìm thấy khách hàng tiềm năng
 *   put:
 *     summary: Sửa khách hàng tiềm năng
 *     tags:
 *       - Leads
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
 *             $ref: '#/components/schemas/LeadInput'
 *     responses:
 *       200:
 *         description: Sửa thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lead'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy khách hàng tiềm năng
 *   delete:
 *     summary: Xoá khách hàng tiềm năng
 *     tags:
 *       - Leads
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
 *         description: Không tìm thấy khách hàng tiềm năng
 */

export default router;
