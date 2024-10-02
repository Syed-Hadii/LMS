import Supplier from "../models/supplierModel.js";

const view = async (req, res) => {
  try {
    const supplier = await Supplier.find({});
    res.json({ success: true, data: supplier });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
const add = async (req, res) => {
  const { name, phone, nic, amount } = req.body;
  try {
    const AddSupplier = new Supplier({
      name,
      phone,
      nic,
      amount,
    });
    const supplier = await AddSupplier.save();
    res.json({ success: true, message: "Supplier Inseted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
const update = async (req, res) => {
  const { id, name, phone, nic, amount } = req.body;
  try {
    const updatedData = {
      name,
      phone,
      nic,
      amount,
    };
    const supplier = await Supplier.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res.json({
      success: true,
      message: "Supplier is updated successfully",
      data: supplier,
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Error updating Supplier." });
  }
};
const destory = async (req, res) => {
  try {
    const data = await Supplier.deleteOne({ _id: req.body.id });
    res.json({ success: true, message: "Supplier deleted successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error deleting Supplier." });
  }
};

export { add, view, update, destory };
