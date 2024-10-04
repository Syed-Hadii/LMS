import express from "express"

import { createChartAccount, getChartAccounts } from "../controllers/chartAccountsController.js"

const chartAccountRouter = express.Router()

chartAccountRouter.post("/add", createChartAccount)
chartAccountRouter.get("/get", getChartAccounts)

export default chartAccountRouter