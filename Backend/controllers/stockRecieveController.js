import Stockrecieve from "../models/stockRecieveModel.js";
import Item from "../models/itemModel.js";

const add = async (req, res) => {
  const { vendorId, stockCon } = req.body;
  try {
    const stockData = stockCon.map((data) => {
      let stockObj = {
        item_id: data.item_id,
        stock_recieved: parseInt(data.stock_recieved),
        stock_amount: data.stock_amount,
        payment_method: data.payment_method,
      };

      if (data.payment_method === "bank") {
        stockObj.bank_name = data.bank_name;
      }

      return stockObj;
    });
    const stockCons = new Stockrecieve({
      vendorId,
      stock: stockData,
    });

      await stockCons.save();
      
  stockCon.forEach((data) => {
    itemStock(data.item_id, parseInt(data.stock_recieved, 10)); // Ensure this is a number
  });
      
    res.json({ success: true, message: "Stock recieve added successfully." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding Stock recieve." });
  }
};
const itemStock = async (item_id, stock_recieved) => {
  try {
    let item = await Item.findOne({ _id: item_id });

    if (!item) {
      console.log("Item not found");
      return;
    }

    let currentQty = item.pkg_qty; 
      let itemQty = currentQty + stock_recieved;
      console.log(currentQty);
      console.log(itemQty);
      

    await Item.updateOne({ _id: item_id }, { pkg_qty: itemQty });
  } catch (error) {
    console.error("Error updating item quantity:", error);
  }
};

const destory = async (req, res) => {
  const { haariId, Id } = req.body;
  try {
    await Stockrecieve.updateOne({ haariId }, { $pull: { land: { _id: Id } } });
    res.json({ success: true, message: "LandxHaari deleted successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error deleting LandxHaari." });
  }
};

const view = async (req, res) => {
  try {
    const Stockrecieve = await LandxHaari.find()
      .populate({
        path: "haariId",
        select: "name",
      })
      .populate({
        path: "land.land_id",
        select: "name",
      });
    res.json({ success: true, data: landxHaariList });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching LandxHaari records." });
  }
};

export { add, destory, view };
