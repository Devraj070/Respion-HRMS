import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Attendance from "@/models/Attendance";
import mongoose from "mongoose";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function POST(req) {
    try {
        await connectToDatabase();

        const user = getUserFromToken(req);

        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        // ⚠️ IMPORTANT: use correct key (_id or id depending on token)
        const userId = new mongoose.Types.ObjectId(user._id || user.id);

        const body = await req.json();
        const now = new Date();

        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const record = await Attendance.findOne({
            user: userId,
            date: { $gte: start, $lte: end }
        });

        if (!record) {
            return NextResponse.json({ success: false, message: "No punch-in found" });
        }

        if (record.checkOut) {
            return NextResponse.json({ success: false, message: "Already punched out" });
        }

        // ⏱️ working hours calculation
        const hours = (now - record.checkIn) / (1000 * 60 * 60);

        // ✅ UPDATE FIELDS
        record.checkOut = now;

        // 🔥 FIX: store checkout location properly
        record.checkOutLocation = body.location || "Unknown";

        record.workingHours = parseFloat(hours.toFixed(2));
        record.overtimeHours =
            record.workingHours > 8 ? record.workingHours - 8 : 0;

        if (record.workingHours < 4) {
            record.status = "half-day";
        } else {
            record.status = "present";
        }

        await record.save();

        return NextResponse.json({
            success: true,
            message: "Punch Out successful",
            data: record
        });

    } catch (err) {
        return NextResponse.json({
            success: false,
            error: err.message
        });
    }
}