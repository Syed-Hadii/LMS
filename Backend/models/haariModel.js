import mongoose from "mongoose";

const haariSchema = new mongoose.Schema({
  name: {
    type: String,
    requird: true,
    },
    address: {
        type: String,
        required:true
    },
    phone: {
        type: String,
        required: true
    },
    nic: {
        type: String,
        required: true
    }
    
});
    const Haari = mongoose.model("Haari", haariSchema);
export default Haari;