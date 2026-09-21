import express from "express";

import { authRequired } from "@/middlewares";

import {
  authRoute,
  classAttendanceRoute,
  classeRoute,
  dashboardRoute,
  employeeRoute,
  leadRoute,
  payrollRoute,
  saleResultRoute,
  sourceRoute,
  studentRoute,
  userRoute,
} from "@/modules";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/users", authRequired, userRoute);
router.use("/sources", authRequired, sourceRoute);
router.use("/employees", authRequired, employeeRoute);
router.use("/classes", authRequired, classeRoute);
router.use("/leads", authRequired, leadRoute);
router.use("/students", authRequired, studentRoute);
router.use("/payroll", authRequired, payrollRoute);
router.use("/dashboard", authRequired, dashboardRoute);
router.use("/sale-results", authRequired, saleResultRoute);
router.use("/class-attendance", authRequired, classAttendanceRoute);

export default router;
