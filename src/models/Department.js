import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: String,
    description: String,
    isDeleted: {
        type: Boolean,
        default: false
    }

});

export default mongoose.models.Department || mongoose.model("Department", departmentSchema);