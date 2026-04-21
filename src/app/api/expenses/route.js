import { NextResponse } from "next/server";
import connectToDB from "@/lib/DB_CONNECTION";
import Expense from "@/models/Expense";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET(req) {
    try {
        await connectToDB();

        const user = await getUserFromToken(req);
        console.log(user);

        // 🔐 only admin can access
        if (!user || user.role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            );
        }

        const expenses = await Expense.find()
            .populate("user", "name email employeeId")
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: expenses
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}