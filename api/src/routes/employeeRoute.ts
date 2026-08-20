import express from "express";

import { employeeController } from "@/controllers";
import { EmployeeCreateDto, EmployeeUpdateDto } from "@/dtos";
import { ValidationPipe } from "@/validations";

const router = express.Router();

router.get("/", employeeController.getList);
router.get("/:id", employeeController.getOne);
router.post("/", ValidationPipe(EmployeeCreateDto), employeeController.create);
router.put("/:id", ValidationPipe(EmployeeUpdateDto), employeeController.update);
router.delete("/:id", employeeController.delete);

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "0197e2f7-0c7b-7d9d-a8d6-7d0b8b7d1234"
 *         firstName:
 *           type: string
 *           example: Nguyen Van
 *         lastName:
 *           type: string
 *           example: A
 *         role:
 *           type: string
 *           enum: [trainer, sale, accountant, manager, admin]
 *           example: trainer
 *         position:
 *           type: string
 *           example: "Senior Trainer"
 *         phone:
 *           type: string
 *           example: "0901234567"
 *         salary:
 *           type: integer
 *           example: 15000000
 *         commissionRate:
 *           type: integer
 *           example: 10
 *         dependents:
 *           type: integer
 *           example: 2
 *     EmployeeInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - role
 *       properties:
 *         firstName:
 *           type: string
 *           example: Nguyen Van
 *         lastName:
 *           type: string
 *           example: A
 *         role:
 *           type: string
 *           enum: [trainer, sale, accountant, manager, admin]
 *           example: trainer
 *         position:
 *           type: string
 *           example: "Senior Trainer"
 *         phone:
 *           type: string
 *           example: "0901234567"
 *         salary:
 *           type: integer
 *           example: 15000000
 *         commissionRate:
 *           type: integer
 *           example: 10
 *         dependents:
 *           type: integer
 *           example: 2
 *
 * /employees:
 *   get:
 *     summary: Lấy danh sách nhân viên
 *     tags:
 *       - Employees
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *   post:
 *     summary: Tạo nhân viên mới
 *     tags:
 *       - Employees
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeInput'
 *     responses:
 *       200:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *
 * /employees/{id}:
 *   get:
 *     summary: Lấy thông tin nhân viên theo id
 *     tags:
 *       - Employees
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
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Không tìm thấy nhân viên
 *   put:
 *     summary: Sửa nhân viên
 *     tags:
 *       - Employees
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
 *             $ref: '#/components/schemas/EmployeeInput'
 *     responses:
 *       200:
 *         description: Sửa thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy nhân viên
 *   delete:
 *     summary: Xoá nhân viên
 *     tags:
 *       - Employees
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
 *         description: Không tìm thấy nhân viên
 */

export default router;
