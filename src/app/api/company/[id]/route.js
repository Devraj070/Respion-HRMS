import { NextResponse } from "next/server";
import Company from "@/models/Company";
import connectToDatabase from "@/lib/DB_CONNECTION";
import mongoose from "mongoose";

export async function PATCH(req, { params }) {
    await connectToDatabase();

    try {
        const { id } = await params;

        // ✅ Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid Company ID" },
                { status: 400 }
            );
        }

        const body = await req.json();

        const updated = await Company.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json(
                { error: "Company not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updated);

    } catch (error) {
        console.error("PATCH ERROR:", error);

        return NextResponse.json(
            {
                error: error.message,
                hint: "Check MongoDB connection, ID validity, or schema"
            },
            { status: 500 }
        );
    }
}