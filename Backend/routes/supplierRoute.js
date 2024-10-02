import express from "express";

import {
  add,
  view,
  update,
  destory,
} from "../controllers/supplierController.js";

const supplierRouter = express.Router();

supplierRouter.post("/add", add);
supplierRouter.get("/get", view);
supplierRouter.put("/update", update);
supplierRouter.delete("/delete", destory);

export default supplierRouter;
