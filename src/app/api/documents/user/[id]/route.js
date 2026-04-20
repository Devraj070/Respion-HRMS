import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Document from "@/models/Document";

export async function GET(req, { params }) {
    try {
        await connectToDatabase();

        const { id } = await params;

        const docs = await Document.find({ user: id })
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