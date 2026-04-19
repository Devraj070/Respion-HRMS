import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import User from "@/models/User";
import "@/models/User";
import "@/models/Department";

// GET ALL
export async function GET() {
    try {
        await connectToDatabase();
        // role will be employee and hr
        const users = await User.find({ role: { $in: ["employee", "hr"] } }).populate("department");

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
export async function POST(req) {
    try {
        await connectToDatabase();
        const body = await req.json();

        if (!body.name || !body.email) {
            return NextResponse.json(
                { success: false, message: "Name & Email required" },
                { status: 400 }
            );
        }

        const user = await User.create(body);
        console.log(user);

        return NextResponse.json(
            { success: true, data: user },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}