import Bank from "../models/bankAccountModel.js";

const save = async (req, res) => {
  const { account_name, type, bank_name, number, address, amount } = req.body;
  try {
    const newBank = new Bank({
      account_name,
      type,
      bank_name,
      number,
      address,
      amount,
    });
    await newBank.save();
    res.json({ success: true, message: "Bank added successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding Bank." });
  }
};

const destory = async (req, res) => {
  try {
    const rezult = await Bank.deleteOne({ _id: req.body.id });
    return res.json({ success: true, message: "Bank is deleted" });
  } catch (error) {
    console.error("Error Deleting User:", error);
    res.json({ success: false, message: "Server error", error });
  }
};

const update = async (req, res) => {
  try {
    const { id, account_name, type, bank_name, number, address, amount } =
      req.body;
    const updatedData = {
      account_name,
      type,
      bank_name,
      number,
      address,
      amount,
    };
    const updatedBank = await Bank.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res.json({ success: true, data: "Bank is Updated" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.json({ success: false, message: "Server error", error });
  }
};

const view = async (req, res) => {
  try {
    const BankList = await Bank.find({});
    res.json({ success: true, data: BankList });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching Bank records." });
  }
};

export { save, destory, update, view };
