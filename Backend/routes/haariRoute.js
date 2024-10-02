import express from "express";
import {
  addHaari,
  deleteHaari,
  updateHaari,
  getHaari,
} from "../controllers/haariController.js";
const haariRouter = express.Router();

haariRouter.post("/addhaari", addHaari);
haariRouter.get("/gethaari", getHaari);
haariRouter.put("/updatehaari", updateHaari);
haariRouter.post("/deletehaari", deleteHaari);

export default haariRouter;
