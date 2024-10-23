import Cash from "../models/cashModel.js";
import ChartAccount from "../models/chartAccountsModel.js";

export const save = async (req, res) => {
  const {  debit, credit, from } = req.body;
  try {
    const newCash = new Cash({
      debit,
      credit,
      from,
    });
    await newCash.save();
    res.json({ success: true, message: "Item added successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding Item." });
  }
};
export const get = async (req, res) => { 
  try {
    const cashEntries = await Cash.find()
      .populate({
        path: "from.acc_name",
        select: "acc_name",
      })
      .populate({
        path: "from.sub_acc.subCat",
        select: "name",
      });

    res.json({ success: true, data: cashEntries });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching cash entries", error });
  }
}
