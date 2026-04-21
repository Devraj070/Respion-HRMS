import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Expense from "@/models/Expense";


export async function GET(req, { params }) {
    try {
        await connectToDatabase();


        const { id } = await params;
        if (!id) {
            return NextResponse.json(
                { error: "Expense ID is required" },
                { status: 400 }
            );
        }


        const expenses = await Expense.find({ user: id })
            .sort({ createdAt: -1 });

        return NextResponse.json(
            { success: true, data: expenses },
            { status: 200 }
        );

    } catch (err) {
        console.error("GET_EXPENSES_ERROR:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}


export async function POST(req, { params }) {
    try {
        await connectToDatabase();

        const { id } = await params;
        if (!id) {
            return NextResponse.json(
                { error: "Expense ID is required" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { amount, category, description, date } = body;

        if (!amount || !category || !date) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const newExpense = await Expense.create({
            user: id,
            amount: Number(amount),
            category,
            description,
            date: new Date(date),
            status: "pending"
        });

        return NextResponse.json(
            { success: true, data: newExpense },
            { status: 201 }
        );

    } catch (err) {
        console.error("POST_EXPENSE_ERROR:", err);
        return NextResponse.json(
            { error: "Could not submit claim" },
            { status: 500 }
        );
    }
}