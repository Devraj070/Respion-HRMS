import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // 📅 Monthly Period
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },

    // 💰 Salary Breakdown
    basicSalary: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },

    // ❗ MANUAL (you control this from API/frontend)
    netSalary: { type: Number, required: true },

    // 💳 Payment Info
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date, default: null },

    // 📝 Notes
    notes: { type: String, default: "" }

}, { timestamps: true });

/**
 * 🔒 One payroll per employee per month/year
 */
payrollSchema.index(
    { user: 1, month: 1, year: 1 },
    { unique: true }
);

export default mongoose.models.Payroll ||
    mongoose.model("Payroll", payrollSchema);