import LandxHaari from "../models/landxhaariModel.js";

const addLandxHaari = async (req, res) => {
  const { haariId, landId } = req.body;

  try {
    const newLandxHaari = new LandxHaari({
      haariId,
      land: landId.map((data) => ({
        land_id: data.land_id,
        crop_name: data.crop_name,
        start_date: data.start_date,
        end_date: data.end_date,
        details: data.details,
      })),
    });
    const hari = await LandxHaari.findOne({ haariId });

    if (hari) {
      const existingLand = hari.land.find((land) =>
        land._id.equals(landId[0].land_id)
      );
      if (existingLand) {
        await LandxHaari.updateOne(
          {
            haariId,
            "land._id": landId[0].land_id,
          },
          {
            $set: {
              "land.$.crop_name": landId[0].crop_name,
              "land.$.start_date": landId[0].start_date,
              "land.$.end_date": landId[0].end_date,
              "land.$.details": landId[0].details,
            },
          }
        );
      } else {
        await LandxHaari.updateOne(
          { haariId },
          { $push: { land: newLandxHaari.land } }
        );
      }
    } else {
      await newLandxHaari.save();
    }
    res.json({ success: true, message: "LandxHaari added successfully." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding LandxHaari." });
  }
};

const deleteLandxHaari = async (req, res) => {
  const { haariId, Id } = req.body;
  try {
    await LandxHaari.updateOne({ haariId }, { $pull: { land: { _id: Id } } });
    res.json({ success: true, message: "LandxHaari deleted successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error deleting LandxHaari." });
  }
};

const getLandxHaari = async (req, res) => {
  const fetchAll = req.query.all === "true"; // Check if the query parameter 'all' is set to true

  try {
    if (fetchAll) {
      // If 'all' is true, fetch all LandxHaari records
      const landxHaariList = await LandxHaari.find()
        .populate({
          path: "haariId",
          select: "name",
        })
        .populate({
          path: "land.land_id",
          select: "name",
        });

      return res.json({
        totalRecord: landxHaariList.length,
        landxHaariList,
      });
    } else {
      // Pagination logic
      const page = parseInt(req.query.page) || 1;
      const limit = 7;
      const skip = (page - 1) * limit;

      const totalRecord = await LandxHaari.countDocuments();
      const landxHaariList = await LandxHaari.find()
        .skip(skip)
        .limit(limit)
        .populate({
          path: "haariId",
          select: "name",
        })
        .populate({
          path: "land.land_id",
          select: "name",
        });

      res.json({
        totalRecord,
        totalPages: Math.ceil(totalRecord / limit),
        currentPage: page,
        landxHaariList,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching LandxHaari records." });
  }
};

export { addLandxHaari, deleteLandxHaari, getLandxHaari };
