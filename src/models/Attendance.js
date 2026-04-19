// /models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    checkInLocation: { type: String, required: true },
    checkOutLocation: { type: String },
    date: Date,

    checkIn: Date,
    checkOut: Date,

    status: {
        type: String,
        enum: ["present", "absent", "half-day"]
    },

    workingHours: Number,
    isLate: Boolean,
    overtimeHours: Number

}, { timestamps: true });

export default mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);