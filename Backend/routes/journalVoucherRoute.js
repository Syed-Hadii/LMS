import express from "express";
import { add } from "../controllers/journalVoucherController.js";
const journalVoucherRouter = express.Router();
journalVoucherRouter.post("/add", add);
export default journalVoucherRouter;
