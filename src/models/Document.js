// /models/Document.js
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Document Info
    title: String, // "Aadhar Card", "Resume", etc.
    type: {
        type: String,
        enum: ["id", "resume", "bank", "certificate", "other"],
        default: "other"
    },

    fileUrl: {
        type: String,
        required: true
    },

    fileName: String,
    fileSize: Number, // optional (in KB/MB)
    mimeType: String, // pdf, jpg, png

    // Access control
    visibility: {
        type: String,
        enum: ["private", "hr", "admin"],
        default: "private"
    },

    // Status (useful for verification)
    status: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending"
    },

    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true });

export default mongoose.models.Document || mongoose.model("Document", documentSchema);