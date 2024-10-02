import mongoose from "mongoose";

// Define the LandxHaari schema
const LandxHaariSchema = new mongoose.Schema({
  haariId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Haari",
    required: true,
  },
  land: [
    {
      land_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Land",
        required: true,
      },
      crop_name: {
        type: String,
        required: true,
      },
      start_date: {
        type: String,
        required: true,
      },
      end_date: {
        type: String,
        required: true,
      },
      details: {
        type: String,
        required: false,
      },
    },
  ],
});

// Create the LandxHaari model
const LandxHaari = mongoose.model("LandxHaari", LandxHaariSchema);

export default LandxHaari;
