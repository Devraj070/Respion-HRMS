import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Leave from "@/models/Leave";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET(req) {
    try {
        await connectToDatabase();

        const user = await getUserFromToken(req);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const leaves = await Leave.find({ user: user.id })
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: leaves
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();

        const user = await getUserFromToken(req);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();

        const { type, fromDate, toDate, reason } = body;

        // 🧠 VALIDATION
        if (!type || !fromDate || !toDate) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const newLeave = await Leave.create({
            user: user.id,
            type,
            fromDate: new Date(fromDate),
            toDate: new Date(toDate),
            reason,
            status: "pending"
        });

        return NextResponse.json({
            success: true,
            message: "Leave request submitted",
            data: newLeave
        }, { status: 201 });

    } catch (err) {
        return NextResponse.json(
            { success: false, message: "Could not submit leave" },
            { status: 500 }
        );
    }
}