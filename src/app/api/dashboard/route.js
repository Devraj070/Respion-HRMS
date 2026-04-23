import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Company from "@/models/Company";
import Attendance from "@/models/Attendance";
import '@/models/Company';
import '@/models/Attendance';

export async function GET() {
    await connectToDatabase();

    try {
        // 🏢 COMPANY
        const company = await Company.findOne();

        // 📅 TODAY RANGE
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        // 🕒 TODAY ATTENDANCE ONLY
        const attendance = await Attendance.find({
            createdAt: { $gte: start, $lte: end }
        })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return NextResponse.json({
            company,
            attendance, // ✅ only today's records
            summary: {
                total: attendance.length,
                present: attendance.filter(a => a.status === "present").length,
                absent: attendance.filter(a => a.status === "absent").length,
                halfDay: attendance.filter(a => a.status === "half-day").length,
            }
        });

    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}