// import { NextResponse } from "next/server";
// import connectToDatabase from "@/lib/DB_CONNECTION";
// import Notice from "@/models/Notice";
// import { getUserFromToken } from "@/lib/getUserFromToken";

// export async function POST(req) {
//     try {
//         await connectToDatabase();

//         const user = getUserFromToken(req);

//         if (!user || user.role !== "admin") {
//             return NextResponse.json(
//                 { success: false, message: "Forbidden" },
//                 { status: 403 }
//             );
//         }

//         const body = await req.json();
//         const { title, message, audience, expiresAt } = body;

//         if (!title || !message) {
//             return NextResponse.json(
//                 { success: false, message: "Title & message required" },
//                 { status: 400 }
//             );
//         }

//         const notice = await Notice.create({
//             title,
//             message,
//             audience: audience || "all",
//             expiresAt: expiresAt ? new Date(expiresAt) : null
//         });

//         return NextResponse.json({
//             success: true,
//             message: "Notice created",
//             data: notice
//         }, { status: 201 });

//     } catch (err) {
//         return NextResponse.json(
//             { success: false, message: err.message },
//             { status: 500 }
//         );
//     }
// }

// export async function GET(req) {
//     try {
//         await connectToDatabase();

//         const user = getUserFromToken(req);

//         if (!user) {
//             return NextResponse.json(
//                 { success: false, message: "Unauthorized" },
//                 { status: 401 }
//             );
//         }

//         const notices = await Notice.find({
//             isActive: true,
//             $or: [
//                 { audience: "all" },
//                 { audience: user.role }
//             ]
//         })
//             .sort({ createdAt: -1 });

//         return NextResponse.json({
//             success: true,
//             data: notices
//         });

//     } catch (err) {
//         return NextResponse.json(
//             { success: false, message: "Error fetching notices" },
//             { status: 500 }
//         );
//     }
// }


import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Notice from "@/models/Notice";
import { getUserFromToken } from "@/lib/getUserFromToken";

// ✅ GET ALL (recent first)
export async function GET() {
    try {
        await connectToDatabase();

        const notices = await Notice.find({ isActive: true })
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: notices
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}

// ✅ CREATE NOTICE (ADMIN ONLY)
export async function POST(req) {
    try {
        await connectToDatabase();

        const user = getUserFromToken(req);

        if (!user || user.role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 403 }
            );
        }

        const { title, message } = await req.json();

        if (!title || !message) {
            return NextResponse.json(
                { success: false, message: "Title & message required" },
                { status: 400 }
            );
        }

        const notice = await Notice.create({ title, message });

        return NextResponse.json({
            success: true,
            message: "Notice created",
            data: notice
        }, { status: 201 });

    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}