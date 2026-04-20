import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    audience: {
        type: String,
        enum: ["all", "admin", "hr", "employee"],
        default: "all"
    },

    isActive: {
        type: Boolean,
        default: true
    },

    expiresAt: {
        type: Date,
        default: null
    }

}, { timestamps: true });

// 🔥 recent first optimization
noticeSchema.index({ createdAt: -1 });

export default mongoose.models.Notice ||
    mongoose.model("Notice", noticeSchema);