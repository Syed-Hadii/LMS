import StoreRoom from "../models/storeModel.js";

const view = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 7;
 const skip = (page - 1) * limit;
  try {
     const totalStore = await StoreRoom.countDocuments();
    const Store = await StoreRoom.find({}).skip(skip).limit(limit);
     res.json({
       totalStore,
       totalPages: Math.ceil(totalStore / limit),
       currentPage: page,
       Store,
     });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
const save = async (req, res) => {
  const { name } = req.body;
  try {
    const AddStore = new StoreRoom({
      name,
    });
    const $Store = await AddStore.save();
    res.json({ success: true, message: "Store Inseted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
const update = async (req, res) => {
  const { id, name } = req.body;
  try {
    const updatedData = {
      name,
    };
    const Store = await StoreRoom.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res.json({
      success: true,
      message: "Store is updated successfully",
      data: Store,
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Error updating Store." });
  }
};
const destory = async (req, res) => {
  try {
    const data = await StoreRoom.deleteOne({ _id: req.body.id });
    res.json({ success: true, message: "Store deleted successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error deleting Store." });
  }
};

export { save, view, update, destory };
