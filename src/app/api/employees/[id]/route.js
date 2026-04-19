import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import User from "@/models/User";

// GET ONE
export async function GET(req, { params }) {
    try {
        await connectToDatabase();

        const user = await User.findById(params.id);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: user });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// UPDATE
export async function PUT(req, { params }) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const id = await params
        console.log(id.id);

        const user = await User.findByIdAndUpdate(id.id, body, {
            returnDocument: 'after'
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: user });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// DELETE
export async function DELETE(req, { params }) {
    try {
        await connectToDatabase();
        const id = await params;

        const user = await User.findByIdAndDelete(id.id);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Deleted successfully" }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}