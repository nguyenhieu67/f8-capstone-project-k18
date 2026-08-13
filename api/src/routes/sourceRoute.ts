import { SourceCreateDto, SourceUpdateDto } from "@/dtos";
import { sourceService } from "@/services";
import { ValidationPipe } from "@/validations";
import express, { type Request, type Response } from "express";

const router = express.Router();

/**
 * @swagger
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
  res.success(await sourceService.getList());
});

/**
 * @swagger
 * /sources:
 *   post:
 *     summary: Tạo khoá học mới
 *     tags:
 *       - Sources
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Finn
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
  ValidationPipe(SourceCreateDto),
  async (req: Request, res: Response) => {
    const newSource = req.body;
    console.log(newSource);

    res.success(await sourceService.create(newSource));
  },
);

/**
 * @swagger
 * /sources/{id}:
 *   put:
 *     summary: Sửa khoá học
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: int
 *     tags:
 *       - Sources
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
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
  ValidationPipe(SourceUpdateDto),
  async (req: Request, res: Response) => {
    const sourceId = Number(req.params.id);
    const newSource = req.body;

    const existingCustomer = await sourceService.findOneBy(sourceId);
    if (!existingCustomer) {
      return res.status(404).send(`Can not find customer with id ${sourceId}`);
    }

    res.success(await sourceService.updateById(sourceId, newSource));
  },
);

/**
 * @swagger
 * /sources/{id}:
 *   delete:
 *     summary: Xoá khoá học
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: int
 *     tags:
 *       - Sources
 *     responses:
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

router.delete("/:id", async (req: Request, res: Response) => {
  const sourceId = Number(req.params.id);

  res.success(await sourceService.deleteById(sourceId));
  res.status(204).send(`Delete`);
});

export default router;
