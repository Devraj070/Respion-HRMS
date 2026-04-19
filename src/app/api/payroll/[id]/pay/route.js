import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Payroll from "@/models/Payroll";

export async function PATCH(req, { params }) {
    try {
        await connectToDatabase();

        const payroll = await Payroll.findByIdAndUpdate(
            params.id,
            {
                isPaid: true,
                paidAt: new Date()
            },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            data: payroll
        });

    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}