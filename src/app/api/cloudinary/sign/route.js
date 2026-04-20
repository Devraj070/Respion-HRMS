// /app/api/cloudinary/sign/route.js
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
    try {
        const timestamp = Math.round(Date.now() / 1000);

        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder: `hrms/documents`,
            },
            process.env.CLOUDINARY_API_SECRET
        );

        return NextResponse.json({
            success: true,
            data: {
                timestamp,
                signature,
                cloudName: process.env.CLOUDINARY_CLOUD_NAME,
                apiKey: process.env.CLOUDINARY_API_KEY,
            },
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}