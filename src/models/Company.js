// /models/Company.js
import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        logo: { type: String }, // store URL
    },
    { timestamps: true }
);

export default mongoose.models.Company || mongoose.model("Company", companySchema);