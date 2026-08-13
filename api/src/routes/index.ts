import express from "express";

import sourceRoute from "./sourceRoute";

const router = express.Router();

router.use("/sources", sourceRoute);

export default router;
