import { LeadCreateDto, LeadUpdateDto } from "@/dtos";
import { leadService } from "@/services";
import { ValidationPipe } from "@/validations";
import express, { type Request, type Response } from "express";

const router = express.Router();

/**
 * @swagger
 * /leads:
 *   get:
 *     summary: Lấy danh sách khách hàng tiềm năng
 *     tags:
 *       - Leads
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
  res.success(await leadService.getList());
});

/**
 * @swagger
 * /leads:
 *   post:
 *     summary: Tạo khách hàng tiềm năng mới
 *     tags:
 *       - Leads
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - seller_id
 *               - first_name
 *               - last_name
 *             properties:
 *               seller_id:
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
  ValidationPipe(LeadCreateDto),
  async (req: Request, res: Response) => {
    const newLead = req.body;
    res.success(await leadService.create(newLead));
  },
);

/**
 * @swagger
 * /leads/{id}:
 *   put:
 *     summary: Sửa khách hàng tiềm năng
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: int
 *     tags:
 *       - Leads
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - seller_id
 *               - first_name
 *               - last_name
 *             properties:
 *               seller_id:
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
  ValidationPipe(LeadUpdateDto),
  async (req: Request, res: Response) => {
    const leadId = Number(req.params.id);
    const newLead = req.body;

    const existing = await leadService.findOneBy(leadId);
    if (!existing) {
      return res.status(404).send(`Can not find ... with id ${leadId}`);
    }

    res.success(await leadService.updateById(leadId, newLead));
  },
);

/**
 * @swagger
 * /leads/{id}:
 *   delete:
 *     summary: Xoá khách hàng tiềm năng
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: int
 *     tags:
 *       - Leads
 *     responses:
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

router.delete("/:id", async (req: Request, res: Response) => {
  const leadId = Number(req.params.id);

  res.success(await leadService.deleteById(leadId));
  res.status(204).send(`Delete`);
});

export default router;
