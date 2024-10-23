import Supplier from "../models/supplierModel.js";

const view = async (req, res) => {
  const fetchAll = req.query.all === "true"; // Check if the query parameter 'all' is set to true

  try {
    if (fetchAll) {
      // If 'all' is true, fetch all Supplier records
      const supplier = await Supplier.find({});
      return res.json({
        totalSupplier: supplier.length,
        supplier,
      });
    } else {
      // Pagination logic
      const page = parseInt(req.query.page) || 1;
      const limit = 7;
      const skip = (page - 1) * limit;

      const totalSupplier = await Supplier.countDocuments();
      const supplier = await Supplier.find({}).skip(skip).limit(limit);

      res.json({
        totalSupplier,
        totalPages: Math.ceil(totalSupplier / limit),
        currentPage: page,
        supplier,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching Supplier records." });
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
