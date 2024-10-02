import express from "express";
import { save, view, destory, update } from "../controllers/bankAccountController.js";
const bankRouter = express.Router();

bankRouter
  .post("/add", save)
  .get("/get", view)
  .delete("/delete", destory)
  .put("/update", update);

export default bankRouter;
