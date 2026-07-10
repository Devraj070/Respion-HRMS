import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Leave from "@/models/Leave";
import mongoose from "mongoose";

export async function GET(req) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const page = searchParams.get("page") ? parseInt(searchParams.get("page")) : null;
        const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")) : null;
        const search = searchParams.get("search") || "";
        const date = searchParams.get("date") || "";

        let query = {};
        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            query.createdAt = { $gte: start, $lte: end };
        }

        if (search) {
            const User = mongoose.models.User || mongoose.model("User");
            const matchedUsers = await User.find({ name: { $regex: search, $options: "i" } }).select("_id");
            const userIds = matchedUsers.map(u => u._id);
            
            query.$or = [
                { user: { $in: userIds } },
                { type: { $regex: search, $options: "i" } }
            ];
        }

        if (page && limit) {
            const skip = (page - 1) * limit;
            const total = await Leave.countDocuments(query);
            const leaves = await Leave.find(query)
                .populate("user", "name employeeId email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            return NextResponse.json({
                success: true,
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
                data: leaves
            });
        }

        const leaves = await Leave.find(query)
            .populate("user", "name employeeId email")
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: leaves
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}