import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import BillPayment from "@/models/BillPayment";
import { getMonthlyAmount, getRazorpayKeys, isBillableMonth, requireAdmin } from "@/lib/billing";

// Create a Razorpay order for a month's bill
export async function POST(req) {
    try {
        const { error } = await requireAdmin(req);
        if (error) return error;

        const { keyId, keySecret } = getRazorpayKeys();
        if (!keyId || !keySecret) {
            return NextResponse.json({ success: false, message: "Razorpay keys are not configured" }, { status: 500 });
        }

        const { month } = await req.json();
        if (!isBillableMonth(month)) {
            return NextResponse.json({ success: false, message: "Invalid billing month" }, { status: 400 });
        }

        await connectToDatabase();

        if (await BillPayment.exists({ month, status: "paid" })) {
            return NextResponse.json({ success: false, message: "This month is already paid" }, { status: 400 });
        }

        // The amount always comes from the server, never from the client
        const amount = Math.round(getMonthlyAmount() * 100);

        const res = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
            },
            body: JSON.stringify({
                amount,
                currency: "INR",
                receipt: `bill_${month}_${Date.now().toString(36)}`,
                notes: { month },
            }),
        });
        const order = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { success: false, message: order?.error?.description || "Could not create Razorpay order" },
                { status: 502 }
            );
        }

        await BillPayment.create({
            month,
            amount,
            currency: "INR",
            razorpayOrderId: order.id,
        });

        return NextResponse.json({
            success: true,
            keyId,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
