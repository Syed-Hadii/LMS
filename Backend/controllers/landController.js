import Land from "../models/landModel.js";

const view_land = async (req, res) => {
  const fetchAll = req.query.all === "true"; 

  try {
    if (fetchAll) {
      
      const land = await Land.find({});
      return res.json({
        totalLands: land.length,
        land,
      });
    } else {
      // Pagination logic
      const page = parseInt(req.query.page) || 1;
      const limit = 7;
      const skip = (page - 1) * limit;

      const totalLands = await Land.countDocuments();
      const land = await Land.find({}).skip(skip).limit(limit);
      res.json({
        totalLands,
        totalPages: Math.ceil(totalLands / limit),
        currentPage: page,
        land,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
const save_land = async (req, res) => {
  const { name, area, size, location } = req.body;
  try {
    const AddLand = new Land({
      name,
      area,
      size,
      location,
    });
    const $land = await AddLand.save();
    res.json({ success: true, message: "Land Inseted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
const update_haari = async (req, res) => {
  const { id, name, area,size, location } = req.body;
  try {
    const updatedData = {
      name,
      area,
      size,
      location,
    };
    const land = await Land.findByIdAndUpdate(id, updatedData, { new: true });
    return res.json({
      success: true,
      message: "Land is updated successfully",
      data: land,
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Error updating Land." });
  }
};
const delete_land = async (req, res) => {
  try {
    const data = await Land.deleteOne({ _id: req.body.id });
    res.json({ success: true, message: "Land deleted successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error deleting Land." });
  }
};

export { save_land, view_land, update_haari, delete_land };
