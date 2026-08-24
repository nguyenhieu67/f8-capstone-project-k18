import express from "express";

import { authRequired } from "@/middlewares";

import { authRoute, classeRoute, employeeRoute, leadRoute, sourceRoute, studentRoute, userRoute } from "@/modules";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/users", authRequired, userRoute);
router.use("/sources", authRequired, sourceRoute);
router.use("/employees", authRequired, employeeRoute);
router.use("/classes", authRequired, classeRoute);
router.use("/leads", authRequired, leadRoute);
router.use("/students", authRequired, studentRoute);

export default router;
