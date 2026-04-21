import { NextResponse } from "next/server";
import connectToDB from "@/lib/DB_CONNECTION";
import Expense from "@/models/Expense";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function PATCH(req, { params }) {
    try {
        await connectToDB();

        const user = await getUserFromToken(req);

        if (!user || user.role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const { status } = await req.json();

        const allowedStatus = ["pending", "approved", "rejected", "paid"];

        if (!allowedStatus.includes(status)) {
            return NextResponse.json(
                { success: false, message: "Invalid status" },
                { status: 400 }
            );
        }

        const updated = await Expense.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate("user", "name email employeeId");

        return NextResponse.json({
            success: true,
            message: "Status updated",
            data: updated
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}