import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import bcrypt from "bcrypt";
import User from "@/models/User";
import "@/models/User";
import "@/models/Department";
import mongoose from "mongoose";

// GET ALL
export async function GET() {
    try {
        await connectToDatabase();
        // role will be employee and hr
        const users = await User.find({ role: { $in: ["employee", "hr"] }, isDeleted: { $ne: true } }).populate("department");

        return NextResponse.json(
            { success: true, data: users },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// CREATE

// export async function POST(req) {
//     try {
//         await connectToDatabase();

//         const body = await req.json();

//         // 🧠 VALIDATION (clean + safe)
//         if (!body.name?.trim()) {
//             return NextResponse.json(
//                 { success: false, message: "Name is required" },
//                 { status: 400 }
//             );
//         }

//         if (!body.email?.trim()) {
//             return NextResponse.json(
//                 { success: false, message: "Email is required" },
//                 { status: 400 }
//             );
//         }

//         if (!body.password || body.password.length < 6) {
//             return NextResponse.json(
//                 { success: false, message: "Password must be at least 6 characters" },
//                 { status: 400 }
//             );
//         }

//         // 🔍 CHECK DUPLICATE EMAIL
//         const existingUser = await User.findOne({ email: body.email });

//         if (existingUser) {
//             return NextResponse.json(
//                 { success: false, message: "Email already exists" },
//                 { status: 409 }
//             );
//         }

//         // 🔐 HASH PASSWORD
//         const hashedPassword = await bcrypt.hash(body.password, 10);

//         const newUser = await User.create({
//             ...body,
//             password: hashedPassword,
//         });

//         // 🚫 NEVER return password
//         const safeUser = newUser.toObject();
//         delete safeUser.password;

//         return NextResponse.json(
//             {
//                 success: true,
//                 message: "User created successfully",
//                 data: safeUser,
//             },
//             { status: 201 }
//         );

//     } catch (error) {
//         console.error("USER_CREATE_ERROR:", error);

//         // 🧠 Mongoose duplicate key error handling
//         if (error.code === 11000) {
//             return NextResponse.json(
//                 { success: false, message: "Duplicate field error (email already exists)" },
//                 { status: 409 }
//             );
//         }

//         return NextResponse.json(
//             { success: false, message: "Internal server error" },
//             { status: 500 }
//         );
//     }
// }




export async function POST(req) {
    try {
        await connectToDatabase();

        const body = await req.json();

        // 🧠 VALIDATION
        if (!body.name?.trim()) {
            return NextResponse.json(
                { success: false, message: "Name is required" },
                { status: 400 }
            );
        }

        if (!body.email?.trim()) {
            return NextResponse.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }

        if (!body.password || body.password.length < 6) {
            return NextResponse.json(
                { success: false, message: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // 🔍 CHECK DUPLICATE EMAIL
        const existingUser = await User.findOne({ email: body.email });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "Email already exists" },
                { status: 409 }
            );
        }

        // 🔐 HASH PASSWORD
        const hashedPassword = await bcrypt.hash(body.password, 10);

        // 🧠 FIX DEPARTMENT (handles "", null, undefined, invalid ObjectId)
        const DEFAULT_DEPARTMENT_ID = "000000000000000000000000";

        if (
            !body.department ||
            !mongoose.Types.ObjectId.isValid(body.department)
        ) {
            body.department = DEFAULT_DEPARTMENT_ID;
        }

        // 🆕 CREATE USER
        const newUser = await User.create({
            ...body,
            password: hashedPassword,
        });

        // 🚫 REMOVE PASSWORD FROM RESPONSE
        const safeUser = newUser.toObject();
        delete safeUser.password;

        return NextResponse.json(
            {
                success: true,
                message: "User created successfully",
                data: safeUser,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("USER_CREATE_ERROR:", error);

        // 🔁 HANDLE DUPLICATE KEY ERROR
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, message: "Email already exists" },
                { status: 409 }
            );
        }

        // ❌ VALIDATION ERROR (like ObjectId cast issues)
        if (error.name === "ValidationError") {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}