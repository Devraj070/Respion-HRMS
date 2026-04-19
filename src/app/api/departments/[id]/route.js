import connectToDatabase from "@/lib/DB_CONNECTION";
import Department from "@/models/Department";

export async function PUT(req, { params }) {
    try {
        await connectToDatabase();
        const id = await params;
        const body = await req.json();

        const updated = await Department.findByIdAndUpdate(
            id?.id,
            body,
            { returnDocument: 'after' }
        );

        return Response.json({
            success: true,
            data: updated
        });

    } catch (err) {
        return Response.json({
            success: false,
            message: err.message
        }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectToDatabase();

        const id = await params;

        await Department.findByIdAndDelete(id?.id);

        return Response.json({
            success: true,
            message: "Department deleted"
        });

    } catch (err) {
        return Response.json({
            success: false,
            message: err.message
        }, { status: 500 });
    }
}