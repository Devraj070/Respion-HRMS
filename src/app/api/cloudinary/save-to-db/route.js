import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Document from "@/models/Document";

export async function POST(req) {
    try {
        await connectToDatabase();

        const body = await req.json();

        const doc = await Document.create({
            user: body.user,
            title: body.title,
            fileUrl: body.fileUrl,
            publicId: body.publicId,
            type: body.type,
        });

        return NextResponse.json({
            success: true,
            data: doc,
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}