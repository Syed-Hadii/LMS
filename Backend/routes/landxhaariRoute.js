import express from "express"

import {
  addLandxHaari,
  // updateLandxHaari ,
  deleteLandxHaari,
  getLandxHaari,
  totalSummary,
} from "../controllers/landxhaariController.js";

const landxhaariRouter = express.Router()

landxhaariRouter.post("/add", addLandxHaari);
landxhaariRouter.put("/update", addLandxHaari);
landxhaariRouter.get("/get", getLandxHaari);
landxhaariRouter.post("/delete", deleteLandxHaari);
landxhaariRouter.get("/summary", totalSummary);

export default landxhaariRouter