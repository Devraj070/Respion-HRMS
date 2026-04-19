// /models/Expense.js
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        enum: ["travel", "food", "office", "client", "other"],
        default: "other"
    },

    description: String,

    date: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "paid"],
        default: "pending"
    }

}, { timestamps: true });

export default mongoose.models.Expense || mongoose.model("Expense", expenseSchema);