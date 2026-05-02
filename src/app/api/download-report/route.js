import connectToDatabase from "@/lib/DB_CONNECTION";
import Expense from "@/models/Expense";
import Advance from "@/models/Advances";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);

        const userId = searchParams.get("userId");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const expenseFilter = {};
        const advanceFilter = {};

        if (userId) {
            expenseFilter.user = userId;
            advanceFilter.employee = userId;
        }

        if (startDate || endDate) {
            const dateFilter = {};
            if (startDate) dateFilter.$gte = new Date(startDate);
            if (endDate) dateFilter.$lte = new Date(endDate);

            expenseFilter.date = dateFilter;
            advanceFilter.requestedAt = dateFilter;
        }

        const [expenses, advances] = await Promise.all([
            Expense.find(expenseFilter).populate("user", "name email").lean(),
            Advance.find(advanceFilter)
                .populate("employee", "name email")
                .populate("approvedBy", "name email")
                .lean(),
        ]);

        const formattedExpenses = expenses.map((e) => ({
            type: "EXPENSE",
            id: e._id,
            amount: e.amount,
            category: e.category,
            description: e.description,
            status: e.status,
            user: e.user,
            date: e.date,
        }));

        const formattedAdvances = advances.map((a) => ({
            type: "ADVANCE",
            id: a._id,
            amount: a.amount,
            purpose: a.purpose,
            description: a.description,
            status: a.status,
            user: a.employee,
            date: a.requestedAt,
        }));

        const history = [...formattedExpenses, ...formattedAdvances]
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        return NextResponse.json({
            success: true,
            count: history.length,
            data: history,
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}