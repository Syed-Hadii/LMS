import express from "express";

import { add, destory, view } from "../controllers/stockConsumeController.js";

const stockConsumeRouter = express.Router();

stockConsumeRouter.post("/add", add).post("/delete", destory).get("/get", view);

export default stockConsumeRouter;
