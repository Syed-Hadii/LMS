import express from "express";
import { add, get, remove, update } from "../controllers/paymentVoucherController.js";

const paymentRecieptRouter = express.Router();

paymentRecieptRouter.post("/add", add);
paymentRecieptRouter.get("/get", get);
paymentRecieptRouter.put("/update", update);
paymentRecieptRouter.delete("/delete", remove);

export default paymentRecieptRouter;
