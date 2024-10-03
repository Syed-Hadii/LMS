import express from "express"

import { createChartAccount } from "../controllers/chartAccountsController.js"

const chartAccountRouter = express.Router()

chartAccountRouter.post("/add", createChartAccount)

export default chartAccountRouter