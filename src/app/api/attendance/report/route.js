import Attendance from "@/models/Attendance";
import connectToDatabase from "@/lib/DB_CONNECTION";


export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);

        const month = Number(searchParams.get("month"));
        const year = Number(searchParams.get("year"));

        if (!month || !year) {
            return Response.json({
                success: false,
                message: "Month and Year required",
            });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const data = await Attendance.find({
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        }).populate("user");

        return Response.json({
            success: true,
            data,
        });
    } catch (err) {
        return Response.json({
            success: false,
            message: err.message,
        });
    }
}