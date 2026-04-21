import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Attendance from "@/models/Attendance";
import mongoose from "mongoose";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function POST(req) {
    try {
        await connectToDatabase();

        const user = await getUserFromToken(req);

        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        const userId = new mongoose.Types.ObjectId(user.id);

        const body = await req.json();
        const now = new Date();

        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const existing = await Attendance.findOne({
            user: userId,
            date: { $gte: start, $lte: end }
        });

        if (existing) {
            return NextResponse.json({ success: false, message: "Already punched in" });
        }

        const record = await Attendance.create({
            user: userId,
            checkInLocation: body.location || "Unknown",
            date: now,
            checkIn: now,
            status: "present",
            isLate: now.getHours() >= 10,
            workingHours: 0,
            overtimeHours: 0
        });

        return NextResponse.json({ success: true, data: record });

    } catch (err) {
        return NextResponse.json({ success: false, error: err.message });
    }
}