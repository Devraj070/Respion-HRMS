import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Notice from "@/models/Notice";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function PATCH(req, { params }) {
    try {
        await connectToDatabase();

        const user = await getUserFromToken(req);

        if (!user || user.role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 403 }
            );
        }

        const { id } = await params;


        const body = await req.json();

        const updated = await Notice.findByIdAndUpdate(
            id,
            body,
            { new: true }
        );

        if (!updated) {
            return NextResponse.json(
                { success: false, message: "Notice not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Notice updated",
            data: updated
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
export async function DELETE(req, { params }) {
    try {
        await connectToDatabase();

        const user = await getUserFromToken(req);

        if (!user || user.role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 403 }
            );
        }

        const { id } = await params;

        const deleted = await Notice.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, message: "Notice not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Notice deleted"
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}