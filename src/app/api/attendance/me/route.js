import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Attendance from "@/models/Attendance";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET(req) {
    try {
        await connectToDatabase();

        // ✅ Get user from JWT
        const userData = getUserFromToken(req);

        if (!userData) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // ✅ Optional filters (date range)
        const { searchParams } = new URL(req.url);
        const from = searchParams.get("from");
        const to = searchParams.get("to");

        let filter = { user: userData.id };

        // 📅 Date filter (optional)
        if (from && to) {
            filter.date = {
                $gte: new Date(from),
                $lte: new Date(to)
            };
        }

        const attendance = await Attendance.find(filter)
            .sort({ date: -1 });

        return NextResponse.json({
            success: true,
            count: attendance.length,
            data: attendance
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}