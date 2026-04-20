import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Leave from "@/models/Leave";

export async function GET() {
    try {
        await connectToDatabase();

        const leaves = await Leave.find({})
            .populate("user", "name employeeId email")
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