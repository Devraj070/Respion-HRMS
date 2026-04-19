import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Leave from "@/models/Leave";
import { getUserFromToken } from "@/lib/getUserFromToken";

// 📦 GET all leaves (or user-specific if needed later)
export async function GET(req) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const user = searchParams.get("user");

        let filter = {};

        // optional filter by user
        if (user) filter.user = user;

        const leaves = await Leave.find(filter)
            .populate({
                path: "user",
                select: "name email employeeId"
            })
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: leaves
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}

// // 📝 CREATE LEAVE (User applies)
// export async function POST(req) {
//     try {
//         await connectToDatabase();

//         const body = await req.json();

//         if (!body.user) {
//             return NextResponse.json(
//                 { error: "User is required" },
//                 { status: 400 }
//             );
//         }

//         const leave = await Leave.create({
//             user: body.user,
//             type: body.type,
//             fromDate: body.fromDate,
//             toDate: body.toDate,
//             reason: body.reason,
//             status: "pending"
//         });

//         return NextResponse.json({
//             success: true,
//             data: leave
//         });

//     } catch (err) {
//         return NextResponse.json(
//             { success: false, error: err.message },
//             { status: 500 }
//         );
//     }
// }


export async function POST(req) {
    try {
        await connectToDatabase();

        const userData = getUserFromToken(req);

        if (!userData) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();

        const leave = await Leave.create({
            user: userData.id, // ✅ from token (secure)
            type: body.type,
            fromDate: body.fromDate,
            toDate: body.toDate,
            reason: body.reason,
            status: "pending"
        });

        return NextResponse.json({
            success: true,
            data: leave
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}