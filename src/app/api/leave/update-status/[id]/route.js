import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Leave from "@/models/Leave";

export async function PATCH(req, { params }) {
    try {
        await connectToDatabase();

        const { id } = await params;
        const { status } = await req.json();

        const allowed = ["approved", "rejected", "pending"];

        if (!allowed.includes(status)) {
            return NextResponse.json(
                { success: false, message: "Invalid status" },
                { status: 400 }
            );
        }

        const updated = await Leave.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate("user", "name employeeId");

        return NextResponse.json({
            success: true,
            message: "Leave status updated",
            data: updated
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}