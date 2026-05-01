// import { NextResponse } from "next/server";
// import connectToDatabase from "@/lib/DB_CONNECTION";
// import Advance from "@/models/Advances";
// import { getUserFromToken } from "@/lib/getUserFromToken";

// export async function PATCH(req, { params }) {
//     try {
//         await connectToDatabase();

//         const { id } = await params;

//         const body = await req.json();
//         const user = await getUserFromToken(req); // approver

//         const updateData = {
//             status: body.status,
//         };

//         // ✅ Approval tracking
//         if (body.status === "APPROVED") {
//             updateData.approvedBy = user?._id || null;
//             updateData.approvedAt = new Date();
//         }

//         // ✅ Settlement tracking
//         if (body.status === "SETTLED") {
//             updateData.settlementDate = new Date();
//         }

//         const updated = await Advance.findByIdAndUpdate(
//             id,
//             updateData,
//             { returnDocument: 'after' }
//         )
//             .populate("employee", "name email")
//             .populate("approvedBy", "name");

//         return NextResponse.json({
//             success: true,
//             data: updated,
//         });
//     } catch (err) {
//         return NextResponse.json({
//             success: false,
//             error: err.message,
//         });
//     }
// }

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import Advance from "@/models/Advances";
import { getUserFromToken } from "@/lib/getUserFromToken";




// ✅ UPDATE (EDIT + STATUS)
export async function PATCH(req, { params }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const body = await req.json();
        const user = await getUserFromToken(req);

        const updateData = {};

        // 🔥 Editable fields
        if (body.amount) updateData.amount = body.amount;
        if (body.purpose) updateData.purpose = body.purpose;
        if (body.description !== undefined)
            updateData.description = body.description;
        if (body.paymentSource)
            updateData.paymentSource = body.paymentSource;

        // 🔄 Status handling
        if (body.status) {
            updateData.status = body.status;

            if (body.status === "APPROVED") {
                updateData.approvedBy = user?._id || null;
                updateData.approvedAt = new Date();
            }

            if (body.status === "SETTLED") {
                updateData.settlementDate = new Date();
            }
        }

        const updated = await Advance.findByIdAndUpdate(
            id,
            updateData,
            { returnDocument: 'after' }
        )
            .populate("employee", "name email")
            .populate("approvedBy", "name");

        return NextResponse.json({
            success: true,
            data: updated,
        });
    } catch (err) {
        return NextResponse.json({
            success: false,
            error: err.message,
        });
    }
}

// ✅ DELETE ADVANCE
export async function DELETE(req, { params }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const deleted = await Advance.findByIdAndDelete(
            id
        );

        if (!deleted) {
            return NextResponse.json({
                success: false,
                message: "Advance not found",
            });
        }

        return NextResponse.json({
            success: true,
            message: "Advance deleted successfully",
        });
    } catch (err) {
        return NextResponse.json({
            success: false,
            error: err.message,
        });
    }
}