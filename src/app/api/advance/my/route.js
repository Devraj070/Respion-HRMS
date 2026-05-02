import connectToDatabase from "@/lib/DB_CONNECTION";
import Advance from "@/models/Advances";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectToDatabase();

        // 👤 Get logged-in user
        const user = await getUserFromToken(req);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // 💰 Fetch user's advances
        const advances = await Advance.find({
            employee: user.id,
        })
            .populate("employee", "name email role")
            .populate("approvedBy", "name email role")
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            count: advances.length,
            data: advances,
        });

    } catch (error) {
        console.log("ADVANCE FETCH ERROR:", error.message);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch advances",
            },
            { status: 500 }
        );
    }
}