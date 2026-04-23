// import { NextResponse } from "next/server";
// import connectToDatabase from "@/lib/DB_CONNECTION";
// import User from "@/models/User";
// import { getUserFromToken } from "@/lib/getUserFromToken"; // Path to your utility

// export async function GET(req) {
//     try {
//         await connectToDatabase();

//         // Securely decode and verify token from headers
//         const decoded = getUserFromToken(req);

//         if (!decoded || !decoded.id) {
//             return NextResponse.json(
//                 { error: "Unauthorized: Invalid or expired token" },
//                 { status: 401 }
//             );
//         }

//         const user = await User.findById(decoded.id)
//             .populate("department", "name")
//             .select("-password");

//         if (!user) {
//             return NextResponse.json({ error: "User not found" }, { status: 404 });
//         }

//         return NextResponse.json({ success: true, data: user });
//     } catch (err) {
//         return NextResponse.json({ error: err.message }, { status: 500 });
//     }
// }



import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import User from "@/models/User";
import Attendance from "@/models/Attendance";
import mongoose from "mongoose";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET(req) {
    try {
        await connectToDatabase();

        const decoded = await getUserFromToken(req); // ✅ FIX (async)

        if (!decoded || !decoded.id) {
            return NextResponse.json(
                { error: "Unauthorized: Invalid or expired token" },
                { status: 401 }
            );
        }

        const userId = new mongoose.Types.ObjectId(decoded.id);

        const user = await User.findById(userId)
            .populate("department", "name")
            .select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 🧠 CHECK TODAY ATTENDANCE
        // const todayRecord = await Attendance.findOne({
        //     user: userId,
        //     checkOut: { $exists: false } // active session
        // }).sort({ checkIn: -1 });


        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const todayRecord = await Attendance.findOne({
            user: userId,
            checkIn: { $gte: start, $lte: end }
        });

        const isPunchedIn = !!todayRecord;

        // return NextResponse.json({
        //     success: true,
        //     data: user,
        //     attendance: {
        //         isPunchedIn,
        //         checkIn: todayRecord?.checkIn || null
        //     }
        // });

        return NextResponse.json({
            success: true,
            data: user,
            attendance: {
                isPunchedIn: todayRecord ? !todayRecord.checkOut : false,
                checkIn: todayRecord?.checkIn || null,
                checkOut: todayRecord?.checkOut || null
            }
        });

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}