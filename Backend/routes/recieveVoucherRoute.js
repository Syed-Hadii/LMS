import express from "express";
import { add, get, remove, update } from "../controllers/recieveVoucherController.js";

const recieveRecieptRouter = express.Router();

recieveRecieptRouter.post("/add", add);
recieveRecieptRouter.get("/get", get);
recieveRecieptRouter.put("/update", update);
recieveRecieptRouter.delete("/delete", remove);

export default recieveRecieptRouter;
