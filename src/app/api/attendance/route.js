import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Attendance from "@/models/Attendance";
import mongoose from "mongoose";
import { getUserFromToken } from "@/lib/getUserFromToken";



// ==========================
//  GET ATTENDANCE (ADMIN) 
//  ==========================



export async function GET(req) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const date = searchParams.get("date");
        const userId = searchParams.get("userId");

        let query = {};

        // 📅 Date filter
        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);

            const end = new Date(date);
            end.setHours(23, 59, 59, 999);

            query.date = { $gte: start, $lte: end };
        }

        // 👤 User filter
        if (userId) {
            query.user = new mongoose.Types.ObjectId(userId)
        }

        const data = await Attendance.find(query)
            .populate("user", "name phone designation") // Populate user details
            .sort({ date: -1 }); // Sort by date descending

        console.log(data);

        return NextResponse.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        });
    }
}


// ==========================
// POST (CREATE MANUAL ATTENDANCE - OPTIONAL)
// ==========================



export async function POST(req) {
    try {
        await connectToDatabase();

        const user = await getUserFromToken(req);

        if (!user?._id) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            });
        }

        const body = await req.json();

        const record = await Attendance.create({
            user: new mongoose.Types.ObjectId(user._id), // 🔥 FIXED
            location: body.location || "Unknown",
            date: new Date(),
            checkIn: body.checkIn || new Date(),
            checkOut: body.checkOut || null,
            status: body.status || "present",
            workingHours: body.workingHours || 0,
            isLate: body.isLate || false,
            overtimeHours: body.overtimeHours || 0
        });

        return NextResponse.json({
            success: true,
            data: record
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        });
    }
}