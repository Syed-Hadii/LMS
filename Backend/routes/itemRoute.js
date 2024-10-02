import express from "express";
import { save, view, destory, update } from "../controllers/itemController.js";
const itemRoter = express.Router();

itemRoter
  .post("/save", save)
  .get("/view", view)
  .delete("/delete", destory)
  .put("/update", update);

export default itemRoter;
