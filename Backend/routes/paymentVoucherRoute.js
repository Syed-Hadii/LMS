import express from "express";
import { add } from "../controllers/paymentVoucherController.js";

const paymentRecieptRouter = express.Router();

paymentRecieptRouter.post("/add", add);

export default paymentRecieptRouter;
