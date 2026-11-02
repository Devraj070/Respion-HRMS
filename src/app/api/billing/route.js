import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import BillPayment from "@/models/BillPayment";
import User from "@/models/User";
import { billingMonths, getMonthlyAmount, requireAdmin, BILLING_START } from "@/lib/billing";

// Bills for every month since billing started + payment history
export async function GET(req) {
    try {
        const { error } = await requireAdmin(req);
        if (error) return error;

        await connectToDatabase();
        void User; // make sure the model is registered for populate

        const payments = await BillPayment.find({ status: "paid" })
            .select("-razorpaySignature")
            .populate("paidBy", "name email")
            .sort({ paidAt: -1 });

        const paidByMonth = new Map(payments.map((p) => [p.month, p]));
        const amount = getMonthlyAmount();

        const bills = billingMonths().map((month) => {
            const paid = paidByMonth.get(month);
            return {
                month,
                amount: paid ? paid.amount / 100 : amount,
                status: paid ? "paid" : "pending",
                paidAt: paid?.paidAt || null,
            };
        });

        return NextResponse.json({
            success: true,
            billingStart: BILLING_START,
            amount,
            bills,
            history: payments,
        });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
