import mongoose from "mongoose";

const AdvanceSchema = new mongoose.Schema(
    {
        // 👤 Employee who took advance
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // 💰 Amount taken
        amount: {
            type: Number,
            required: true,
            min: 1,
        },

        // 📌 Purpose of advance
        purpose: {
            type: String,
            enum: [
                "TRAVEL",           // bus/train/tour
                "FOOD",             // mess / meals
                "OFFICE_PURCHASE",  // office items
                "COURIER",          // courier charges
                "LOGISTICS",        // shifting goods
                "OTHER",
            ],
            required: true,
        },

        // 📝 Extra details
        description: {
            type: String,
            trim: true,
        },

        // 🔄 Status flow
        status: {
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED", "SETTLED"],
            default: "PENDING",
        },

        // 👨‍💼 Who approved
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        // 💵 Payment source (optional but useful)
        paymentSource: {
            type: String,
            enum: ["CASH", "BANK", "UPI"],
            default: "CASH",
        },

        // 📅 Dates
        requestedAt: {
            type: Date,
            default: Date.now,
        },

        approvedAt: Date,
        settlementDate: Date,

        // 🧾 Optional: store bill proof (future use)
        billImage: {
            type: String, // URL (Cloudinary / S3)
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Advance ||
    mongoose.model("Advance", AdvanceSchema);