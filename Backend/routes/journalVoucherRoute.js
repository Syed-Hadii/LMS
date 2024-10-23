import express from "express";
import { add, get, remove, update } from "../controllers/journalVoucherController.js";
const journalVoucherRouter = express.Router();
journalVoucherRouter.post("/add", add).get("/get", get).delete("/delete", remove).put("/update", update)
export default journalVoucherRouter;
