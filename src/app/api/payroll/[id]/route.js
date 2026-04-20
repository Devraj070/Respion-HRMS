import { NextResponse } from "next/server";
import connectionToDB from "@/lib/DB_CONNECTION";
import Payroll from "@/models/Payroll";

export async function GET(req, { params }) {
    try {
        await connectionToDB();
        const { id } = await params;
        const payroll = await Payroll.findOne({ user: id }).populate({
            path: "user",
            select: "name email employeeId"
        });

        if (!payroll) {
            return NextResponse.json(
                { success: false, message: "Payroll not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: payroll
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    try {
        await connectionToDB();

        const id = await params;

        const body = await req.json();

        if (body.isPaid) {
            body.paidAt = new Date();
        }

        const updated = await Payroll.findByIdAndUpdate(
            id?.id,
            body,
            { returnDocument: 'after' }
        );

        return NextResponse.json({
            success: true,
            data: updated
        });

    } catch (err) {
        if (err.code === 11000) {
            return NextResponse.json(
                { error: "Duplicate payroll for this month/year" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectionToDB();
        const id = await params;
        await Payroll.findByIdAndDelete(id?.id);

        return NextResponse.json({
            success: true,
            message: "Deleted successfully"
        });

    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}