import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import BillPayment from "@/models/BillPayment";
import { requireAdmin, verifySignature } from "@/lib/billing";

// Verify the Razorpay signature and mark the bill as paid
export async function POST(req) {
    try {
        const { user, error } = await requireAdmin(req);
        if (error) return error;

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ success: false, message: "Missing payment details" }, { status: 400 });
        }

        await connectToDatabase();

        const payment = await BillPayment.findOne({ razorpayOrderId: razorpay_order_id });
        if (!payment) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }
        if (payment.status === "paid") {
            return NextResponse.json({ success: true });
        }

        if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
            payment.status = "failed";
            await payment.save();
            return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 400 });
        }

        payment.status = "paid";
        payment.razorpayPaymentId = razorpay_payment_id;
        payment.razorpaySignature = razorpay_signature;
        payment.paidBy = user.id;
        payment.paidAt = new Date();
        await payment.save();

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
