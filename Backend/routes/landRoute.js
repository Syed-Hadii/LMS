import express from "express";
import { save_land, view_land, delete_land, update_haari } from "../controllers/landController.js";
const landRouter = express.Router();

landRouter.post("/add_land", save_land)
landRouter.get("/list_land", view_land);
landRouter.post("/delete", delete_land)
    landRouter.put("/update", update_haari)


export default landRouter

