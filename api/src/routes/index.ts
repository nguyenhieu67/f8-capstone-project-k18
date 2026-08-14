import express from "express";

import sourceRoute from "./sourceRoute";
import employeeRoute from "./employeeRoute";
import classeRoute from "./classeRoute";

const router = express.Router();

router.use("/sources", sourceRoute);
router.use("/employees", employeeRoute);
router.use("/classes", classeRoute);

export default router;
