import Haari from "../models/haariModel.js";

// Add a new Haari
const addHaari = async (req, res) => {
  const { name, address, phone, nic } = req.body;
  try {
    const newHaari = new Haari({
      name,
      address,
      phone,
      nic,
    });
    await newHaari.save();
    res.json({ success: true, message: "Haari added successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding Haari." });
  }
};

// Delete a Haari by ID
const deleteHaari = async (req, res) => {
  try {
    const rezult = await Haari.deleteOne({ _id: req.body.id })
        return res.json({ success: true, message: "Haari is deleted" });
  } catch (error) {
    console.error("Error Deleting User:", error);
    res.json({ success: false, message: "Server error", error });
  }
};

// Update a Haari by ID
const updateHaari = async (req, res) => {
  try {
    const haariId = req.body.id;
    const updatedData = req.body;
    const updatedHaari = await Haari.findByIdAndUpdate(haariId, updatedData, { new: true });
        return res.json({ success: true, message: "User is Updated" });
 } catch (error) {
   console.error("Error updating user:", error);
   res.json({ success: false, message: "Server error", error });
 }
};

// Get all Haari records
const getHaari = async (req, res) => {
  
   const fetchAll = req.query.all === "true";

   try {
     if (fetchAll) {
       const haari = await Haari.find({});
       return res.json({
         totalHaari: haari.length,
         haari,
       });
     } else {
       // Pagination logic
       const page = parseInt(req.query.page) || 1;
       const limit = 7;
       const skip = (page - 1) * limit;

       const totalHaari = await Haari.countDocuments();
       const haari = await Haari.find({}).skip(skip).limit(limit);
       res.json({
         totalHaari,
         totalPages: Math.ceil(totalHaari / limit),
         currentPage: page,
         haari,
       });
     }
   } catch (error) {
     console.log(error);
     res.json({ success: false, message: "Error" });
   }
};

export { addHaari, deleteHaari, updateHaari, getHaari };
