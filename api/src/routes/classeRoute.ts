import { ClasseCreateDto, ClasseUpdateDto } from "@/dtos";
import { classeService } from "@/services";
import { ValidationPipe } from "@/validations";
import express, { type Request, type Response } from "express";

const router = express.Router();

/**
 * @swagger
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
  res.success(await classeService.getList());
});

/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Tạo lớp học mới
 *     tags:
 *       - Classes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trainer_id
 *               - code
 *               - name
 *             properties:
 *               trainer_id:
 *                 type: number
 *                 example: 1
 *               code:
 *                 type: string
 *                 example: "A BASIC"
 *               name:
 *                 type: string
 *                 example: "Khoa hoc co ban A"
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
  ValidationPipe(ClasseCreateDto),
  async (req: Request, res: Response) => {
    const newClasse = req.body;
    res.success(await classeService.create(newClasse));
  },
);

/**
 * @swagger
 * /classes/{id}:
 *   put:
 *     summary: Sửa lớp học
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: int
 *     tags:
 *       - Classes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trainer_id
 *               - code
 *               - name
 *             properties:
 *               trainer_id:
 *                 type: number
 *               code:
 *                 type: string
 *               name:
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
  ValidationPipe(ClasseUpdateDto),
  async (req: Request, res: Response) => {
    const classeId = Number(req.params.id);
    const newClasse = req.body;

    const existing = await classeService.findOneBy(classeId);
    if (!existing) {
      return res.status(404).send(`Can not find ... with id ${classeId}`);
    }

    res.success(await classeService.updateById(classeId, newClasse));
  },
);

/**
 * @swagger
 * /classes/{id}:
 *   delete:
 *     summary: Xoá lớp học
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: int
 *     tags:
 *       - Classes
 *     responses:
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

router.delete("/:id", async (req: Request, res: Response) => {
  const classeId = Number(req.params.id);

  res.success(await classeService.deleteById(classeId));
  res.status(204).send(`Delete`);
});

export default router;
