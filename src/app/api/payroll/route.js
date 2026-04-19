import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Payroll from "@/models/Payroll";

export async function GET() {
    try {
        await connectToDatabase();

        const payrolls = await Payroll.find()
            .populate({
                path: "user",
                select: "name email employeeId"
            })
            .sort({ year: -1, month: -1 });

        return NextResponse.json({
            success: true,
            data: payrolls
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();

        const body = await req.json();

        // ❗ Manual net salary required
        if (body.netSalary === undefined) {
            return NextResponse.json(
                { error: "netSalary is required" },
                { status: 400 }
            );
        }

        // 💳 Paid date logic
        if (body.isPaid) {
            body.paidAt = new Date();
        }

        const payroll = await Payroll.create(body);

        return NextResponse.json({
            success: true,
            data: payroll
        });

    } catch (err) {
        // 🔒 Duplicate monthly record
        if (err.code === 11000) {
            return NextResponse.json(
                { error: "Payroll already exists for this employee for this month/year" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}