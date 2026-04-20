// /models/Document.js
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        title: String,
        fileUrl: String,
        publicId: String,
        type: {
            type: String,
            enum: ["pdf", "image", "video", "other"],
            default: "pdf",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Document ||
    mongoose.model("Document", documentSchema);