import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Advance from "@/models/Advances";

// ✅ CREATE ADVANCE
export async function POST(req) {
    try {
        await connectToDatabase();

        const body = await req.json();

        if (!body.employeeId || !body.amount || !body.purpose) {
            return NextResponse.json({
                success: false,
                message: "Missing required fields",
            });
        }

        const advance = await Advance.create({
            employee: body.employeeId,
            amount: body.amount,
            purpose: body.purpose,
            paymentSource: body.paymentSource || "CASH",
            description: body.description,
        });

        return NextResponse.json({
            success: true,
            data: advance,
        });
    } catch (err) {
        return NextResponse.json({
            success: false,
            error: err.message,
        });
    }
}

// ✅ GET ALL ADVANCES
export async function GET(req) {
    try {
        await connectToDatabase();

        const advances = await Advance.find()
            .populate("employee", "name email")
            .populate("approvedBy", "name")
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: advances,
        });
    } catch (err) {
        return NextResponse.json({
            success: false,
            data: [],
        });
    }
}