import express from "express"
import { get, save } from "../controllers/cashController.js"

const cashRouter = express.Router()

cashRouter.post("/save", save)
cashRouter.get("/get", get)

export default cashRouter