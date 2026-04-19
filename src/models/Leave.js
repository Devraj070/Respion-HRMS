// /models/Leave.js
import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    type: String, // Sick / Casual / Paid

    fromDate: Date,
    toDate: Date,

    reason: String,

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }

}, { timestamps: true });

export default mongoose.models.Leave || mongoose.model("Leave", leaveSchema);