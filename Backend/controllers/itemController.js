import Item from "../models/itemModel.js";

const save = async (req, res) => {
  const { name, unit, store_id, pkg_qty, pkg_amount } = req.body;
  try {
    const newItem = new Item({
      name,
      unit,
      store_id,
      pkg_qty,
      pkg_amount,
          });
    await newItem.save();
    res.json({ success: true, message: "Item added successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding Item." });
  }
};

const destory = async (req, res) => {
  try {
    const rezult = await Item.deleteOne({ _id: req.body.id });
    return res.json({ success: true, message: "Item is deleted" });
  } catch (error) {
    console.error("Error Deleting User:", error);
    res.json({ success: false, message: "Server error", error });
  }
};

const update = async (req, res) => {
  try {
    const { id, name, unit, store_id, pkg_qty, pkg_amount } = req.body;
    const updatedData = { name, unit, store_id, pkg_qty, pkg_amount };
    const updatedItem = await Item.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res.json({
      success: true,
      data: updatedItem,
      message: "Item is Updated",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.json({ success: false, message: "Server error", error });
  }
};

const view = async (req, res) => {
  const fetchAll = req.query.all === "true"; // Check if the query parameter 'all' is set to true

  try {
    if (fetchAll) {
      // If 'all' is true, fetch all Item records
      const ItemList = await Item.find({});
      return res.json({
        totalItems: ItemList.length,
        ItemList,
      });
    } else {
      // Pagination logic
      const page = parseInt(req.query.page) || 1;
      const limit = 7;
      const skip = (page - 1) * limit;

      const totalItems = await Item.countDocuments();
      const ItemList = await Item.find({}).skip(skip).limit(limit);

      res.json({
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        ItemList,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching Item records." });
  }
};


export { save, destory, update, view };
