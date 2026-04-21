import connectToDatabase from "@/lib/DB_CONNECTION";
import Department from "@/models/Department";
import User from "@/models/User";

export async function GET() {
    try {
        await connectToDatabase();

        const departments = await Department.find().lean();

        // attach employees
        const data = await Promise.all(
            departments.map(async (dep) => {
                const employees = await User.find({ department: dep._id })
                    .select("name email designation")
                    .lean();

                return {
                    ...dep,
                    employees,
                    count: employees.length
                };
            })
        );

        return Response.json({
            success: true,
            data
        });

    } catch (err) {
        return Response.json({
            success: false,
            message: err.message
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();

        const body = await req.json();

        const dept = await Department.create({
            name: body.name,
            description: body.description
        });

        return Response.json({
            success: true,
            data: dept
        });

    } catch (err) {
        return Response.json({
            success: false,
            message: err.message
        }, { status: 500 });
    }
}