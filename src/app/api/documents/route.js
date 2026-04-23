import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Document from "@/models/Document";

export async function GET() {
    try {
        await connectToDatabase();

        const docs = await Document.find({})
            .populate({
                path: "user",
                select: "name email employeeId",
            })
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: docs,
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}