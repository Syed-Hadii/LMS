import express from "express"

import { createChartAccount, deleteChartAccount, getChartAccounts, updateChartAccount } from "../controllers/chartAccountsController.js"

const chartAccountRouter = express.Router()

chartAccountRouter.post("/add", createChartAccount)
chartAccountRouter.get("/get", getChartAccounts)
chartAccountRouter.put("/update", updateChartAccount)
chartAccountRouter.delete("/delete", deleteChartAccount)

export default chartAccountRouter