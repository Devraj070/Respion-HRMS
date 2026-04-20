// /app/api/company/route.js
import { NextResponse } from "next/server";
import Company from "@/models/Company";
import connectToDatabase from "@/lib/DB_CONNECTION";

// GET company
export async function GET() {
    await connectToDatabase();

    const company = await Company.findOne();
    return NextResponse.json(company || {});
}

// CREATE company
export async function POST(req) {
    await connectToDatabase();

    const body = await req.json();

    const existing = await Company.findOne();
    if (existing) {
        return NextResponse.json(
            { message: "Company already exists. Use PATCH." },
            { status: 400 }
        );
    }

    const company = await Company.create(body);
    return NextResponse.json(company);
}