import express from "express";

import { authRequired } from "@/middlewares";

import authRoute from "./authRoute";
import userRoute from "./userRoute";
import sourceRoute from "./sourceRoute";
import employeeRoute from "./employeeRoute";
import classeRoute from "./classeRoute";
import leadRoute from "./leadRoute";
import studentRoute from "./studentRoute";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/users", authRequired, userRoute);
router.use("/sources", authRequired, sourceRoute);
router.use("/employees", authRequired, employeeRoute);
router.use("/classes", authRequired, classeRoute);
router.use("/leads", authRequired, leadRoute);
router.use("/students", authRequired, studentRoute);

export default router;
