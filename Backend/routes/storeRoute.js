import express from "express";
import { save, view, destory, update } from "../controllers/storeController.js";
const storeRouter = express.Router();

storeRouter
  .post("/save", save)
  .get("/get", view)
  .post("/delete", destory)
  .put("/update", update);

export default storeRouter;
