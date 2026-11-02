import mongoose from "mongoose";

const billPaymentSchema = new mongoose.Schema(
    {
        month: { type: String, required: true }, // YYYY-MM
        amount: { type: Number, required: true }, // in paise
        currency: { type: String, default: "INR" },
        status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
        razorpayOrderId: { type: String, required: true, unique: true },
        razorpayPaymentId: { type: String },
        razorpaySignature: { type: String },
        paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        paidAt: { type: Date },
    },
    { timestamps: true }
);

// A month can only be paid once
billPaymentSchema.index(
    { month: 1 },
    { unique: true, partialFilterExpression: { status: "paid" } }
);

export default mongoose.models.BillPayment || mongoose.model("BillPayment", billPaymentSchema);
