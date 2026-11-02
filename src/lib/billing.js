import crypto from "crypto";
import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";

// Billing starts from this month (YYYY-MM)
export const BILLING_START = "2026-11";

// Monthly bill in rupees, set MONTHLY_BILL_AMOUNT in .env
export const getMonthlyAmount = () => Number(process.env.MONTHLY_BILL_AMOUNT) || 3500;

export const getRazorpayKeys = () => ({
    keyId: process.env.Razorpay_API_KEY?.trim(),
    keySecret: process.env.Razorpay_KEY_SECRET?.trim(),
});

export const currentMonth = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// Every month from BILLING_START up to the current month, newest first
export const billingMonths = () => {
    const now = currentMonth();
    const months = [];
    let [y, m] = BILLING_START.split("-").map(Number);
    let key = BILLING_START;
    while (key <= now) {
        months.push(key);
        m += 1;
        if (m > 12) { m = 1; y += 1; }
        key = `${y}-${String(m).padStart(2, "0")}`;
    }
    return months.reverse();
};

export const isBillableMonth = (month) => /^\d{4}-\d{2}$/.test(month) && billingMonths().includes(month);

export const verifySignature = (orderId, paymentId, signature) => {
    const { keySecret } = getRazorpayKeys();
    const expected = crypto
        .createHmac("sha256", keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(String(signature || ""));
    return a.length === b.length && crypto.timingSafeEqual(a, b);
};

// Returns { user } or { error: NextResponse }
export const requireAdmin = async (req) => {
    const user = await getUserFromToken(req);
    if (!user || user.role !== "admin") {
        return { error: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) };
    }
    return { user };
};
