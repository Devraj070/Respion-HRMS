import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Document from "@/models/Document";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(req, { params }) {
    try {
        await connectToDatabase();

        const { id } = await params;

        const doc = await Document.findById(id);

        if (!doc) {
            return NextResponse.json(
                { success: false, message: "Document not found" },
                { status: 404 }
            );
        }

        // 🔥 SAFE CLOUDINARY DELETE
        if (doc.publicId) {
            try {
                await cloudinary.uploader.destroy(doc.publicId, {
                    resource_type: "image", // ✅ FIXED
                });
            } catch (cloudErr) {
                console.log("Cloudinary delete error:", cloudErr.message);
                // ❗ Don't block DB delete if cloud fails
            }
        }

        await Document.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: "Document deleted successfully",
        });

    } catch (err) {
        console.log("DELETE_DOC_ERROR:", err);

        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}