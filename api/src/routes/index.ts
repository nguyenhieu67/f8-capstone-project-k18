import express from "express";

import sourceRoute from "./sourceRoute";
import employeeRoute from "./employeeRoute";
import classeRoute from "./classeRoute";
import leadRoute from "./leadRoute";
import studentRoute from "./studentRoute";

const router = express.Router();

router.use("/sources", sourceRoute);
router.use("/employees", employeeRoute);
router.use("/classes", classeRoute);
router.use("/leads", leadRoute);
router.use("/students", studentRoute);

export default router;
