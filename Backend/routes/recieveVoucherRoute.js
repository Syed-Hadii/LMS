import express from "express";
import { add } from "../controllers/recieveVoucherController.js";

const recieveRecieptRouter = express.Router();

recieveRecieptRouter.post("/add", add);

export default recieveRecieptRouter;
