import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import User from "@/models/User";
import { getUserFromToken } from "@/lib/getUserFromToken"; // Path to your utility

export async function GET(req) {
    try {
        await connectToDatabase();

        // Securely decode and verify token from headers
        const decoded = getUserFromToken(req);

        if (!decoded || !decoded.id) {
            return NextResponse.json(
                { error: "Unauthorized: Invalid or expired token" },
                { status: 401 }
            );
        }

        const user = await User.findById(decoded.id)
            .populate("department", "name")
            .select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}