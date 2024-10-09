import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";
import addUserRouter from "./routes/addUserRoute.js";
import landRouter from "./routes/landRoute.js";
import haariRouter from "./routes/haariRoute.js";
import landxhaariRouter from "./routes/landxhaariRoute.js";
import supplierRouter from "./routes/supplierRoute.js";
import storeRouter from "./routes/storeRoute.js";
import bankRouter from "./routes/bankAccountRoute.js";
import itemRoter from "./routes/itemRoute.js";
import stockConsumeRouter from "./routes/stockConsumeRoute.js";
import stockrecieveRouter from "./routes/stockRecieveRoute.js";
import chartAccountRouter from "./routes/chartAccountsRoute.js";
import paymentRecieptRouter from "./routes/paymentVoucherRoute.js";
import recieveRecieptRouter from "./routes/recieveVoucherRoute.js";
import journalVoucherRouter from "./routes/journalVoucherRoute.js";

const app = express();
const port = 3002;
dotenv.config();

app.use(express.json())
app.use(cors())

connectDB()

app.use("/adduser", addUserRouter)
app.use("/land", landRouter)
app.use("/haari", haariRouter)
app.use("/landxhaari", landxhaariRouter)
app.use("/supplier", supplierRouter)
app.use("/store", storeRouter)
app.use("/bank", bankRouter)
app.use("/items", itemRoter)
app.use("/stockconsume", stockConsumeRouter)
app.use("/stockrecieve", stockrecieveRouter)
app.use("/chartaccount", chartAccountRouter)
app.use("/paymentreciept", paymentRecieptRouter);
app.use("/recievereciept", recieveRecieptRouter);
app.use("/journalvoucher", journalVoucherRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
