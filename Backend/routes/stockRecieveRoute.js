import express from "express";

import { add, destory, view } from "../controllers/stockRecieveController.js";

const stockrecieveRouter = express.Router();

stockrecieveRouter.post("/add", add).post("/delete", destory).get("/get", view);

export default stockrecieveRouter;
