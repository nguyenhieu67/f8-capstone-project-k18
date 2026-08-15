import { StudentCreateDto, StudentUpdateDto } from "@/dtos";
import { studentService } from "@/services";
import { ValidationPipe } from "@/validations";
import express, { type Request, type Response } from "express";

const router = express.Router();

/**
 * @swagger
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
  res.success(await studentService.getList());
});

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Tạo học sinh mới
 *     tags:
 *       - Students
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lead_id
 *               - first_name
 *               - last_name
 *             properties:
 *               lead_id:
 *                 type: number
 *                 example: 1
 *               first_name:
 *                 type: string
 *                 example: "Nguyen Van"
 *               last_name:
 *                 type: string
 *                 example: "A"
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
  ValidationPipe(StudentCreateDto),
  async (req: Request, res: Response) => {
    const newStudent = req.body;
    res.success(await studentService.create(newStudent));
  },
);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Sửa học sinh
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: int
 *     tags:
 *       - Students
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lead_id
 *               - first_name
 *               - last_name
 *             properties:
 *               lead_id:
 *                 type: number
 *               first_name:
 *                 type: string
 *               last_name:
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
  ValidationPipe(StudentUpdateDto),
  async (req: Request, res: Response) => {
    const studentId = Number(req.params.id);
    const newStudent = req.body;

    const existing = await studentService.findOneBy(studentId);
    if (!existing) {
      return res.status(404).send(`Can not find ... with id ${studentId}`);
    }

    res.success(await studentService.updateById(studentId, newStudent));
  },
);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Xoá học sinh
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: int
 *     tags:
 *       - Students
 *     responses:
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

router.delete("/:id", async (req: Request, res: Response) => {
  const studentId = Number(req.params.id);

  res.success(await studentService.deleteById(studentId));
  res.status(204).send(`Delete`);
});

export default router;
