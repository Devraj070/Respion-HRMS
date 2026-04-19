import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Leave from "@/models/Leave";

// 📦 GET single leave
export async function GET(req, { params }) {
    try {
        await connectToDatabase();

        const leave = await Leave.findById(params.id).populate({
            path: "user",
            select: "name email employeeId"
        });

        if (!leave) {
            return NextResponse.json(
                { error: "Leave not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: leave
        });

    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}

// ✏️ UPDATE LEAVE (Admin: approve/reject)
export async function PUT(req, { params }) {
    try {
        await connectToDatabase();

        const body = await req.json();

        const updateData = {
            status: body.status,
        };

        const leave = await Leave.findByIdAndUpdate(
            params.id,
            updateData,
            { new: true }
        ).populate({
            path: "user",
            select: "name email employeeId"
        });

        return NextResponse.json({
            success: true,
            data: leave
        });

    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}

// ❌ DELETE leave
export async function DELETE(req, { params }) {
    try {
        await connectToDatabase();

        await Leave.findByIdAndDelete(params.id);

        return NextResponse.json({
            success: true,
            message: "Leave deleted"
        });

    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}