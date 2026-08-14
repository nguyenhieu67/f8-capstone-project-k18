import { EmployeeCreateDto, EmployeeUpdateDto } from "@/dtos";
import { employeeService } from "@/services";
import { ValidationPipe } from "@/validations";
import express, { type Request, type Response } from "express";

const router = express.Router();

/**
 * @swagger
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
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "0197e2f7-0c7b-7d9d-a8d6-7d0b8b7d1234"
 *                   name:
 *                     type: string
 *                     example: John Doe
 *
 *
 */

router.get("/", async (req: Request, res: Response) => {
  res.success(await employeeService.getList());
});

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Tạo nhân viên mới
 *     tags:
 *       - Employees
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - role
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Nguyen Van
 *               last_name:
 *                 type: string
 *                 example: A
 *               role:
 *                 type: string
 *                 example: trainer
 *     responses:
 *       200:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "0197e2f7-0c7b-7d9d-a8d6-7d0b8b7d1234"
 *                 name:
 *                   type: string
 *                   example: Finn
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

router.post(
  "/",
  ValidationPipe(EmployeeCreateDto),
  async (req: Request, res: Response) => {
    const newEmployee = req.body;
    res.success(await employeeService.create(newEmployee));
  },
);

/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Sửa nhân viên
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: int
 *     tags:
 *       - Employees
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - role
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sửa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "0197e2f7-0c7b-7d9d-a8d6-7d0b8b7d1234"
 *                 name:
 *                   type: string
 *                   example: Finn
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

router.put(
  "/:id",
  ValidationPipe(EmployeeUpdateDto),
  async (req: Request, res: Response) => {
    const employeeId = Number(req.params.id);
    const newEmployee = req.body;

    const existingCustomer = await employeeService.findOneBy(employeeId);
    if (!existingCustomer) {
      return res
        .status(404)
        .send(`Can not find customer with id ${employeeId}`);
    }

    res.success(await employeeService.updateById(employeeId, newEmployee));
  },
);

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Xoá nhân viên
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: int
 *     tags:
 *       - Employees
 *     responses:
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

router.delete("/:id", async (req: Request, res: Response) => {
  const employeeId = Number(req.params.id);

  res.success(await employeeService.deleteById(employeeId));
  res.status(204).send(`Delete`);
});

export default router;
