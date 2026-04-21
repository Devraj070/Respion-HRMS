import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/DB_CONNECTION";
import User from "@/models/User";
import bcrypt from "bcrypt";

// GET ONE
export async function GET(req, { params }) {
    try {
        await connectToDatabase();

        const user = await User.findById(params.id);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: user });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// UPDATE
// export async function PUT(req, { params }) {
//     try {
//         await connectToDatabase();
//         const body = await req.json();
//         const id = await params
//         console.log(id.id);

//         const user = await User.findByIdAndUpdate(id.id, body, {
//             returnDocument: 'after'
//         });

//         if (!user) {
//             return NextResponse.json(
//                 { success: false, message: "User not found" },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json({ success: true, data: user });

//     } catch (error) {
//         return NextResponse.json(
//             { success: false, message: error.message },
//             { status: 500 }
//         );
//     }
// }



export async function PUT(req, { params }) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { id } = await params;

        console.log("USER ID:", id);

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Invalid user id" },
                { status: 400 }
            );
        }

        // 🧠 DEFAULT DEPARTMENT FIX
        const DEFAULT_DEPARTMENT_ID = "000000000000000000000000";

        if (!body.department || body.department === "") {
            body.department = DEFAULT_DEPARTMENT_ID;
        }

        // 🔐 PASSWORD HASHING
        // if (body.password) {
        //     const hashedPassword = await bcrypt.hash(body.password, 10);
        //     body.password = hashedPassword;
        // }


        if (body.password && body.password.trim() !== "") {
            body.password = await bcrypt.hash(body.password, 10);
        } else {
            delete body.password; // ✅ keep old password
        }


        const user = await User.findByIdAndUpdate(id, body, {
            returnDocument: 'after',
            runValidators: true
        }).populate("department", "name");

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: user
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message
            },
            { status: 500 }
        );
    }
}

// DELETE
// export async function DELETE(req, { params }) {
//     try {
//         await connectToDatabase();
//         const id = await params;

//         const user = await User.findByIdAndDelete(id.id);

//         if (!user) {
//             return NextResponse.json(
//                 { success: false, message: "User not found" },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json(
//             { success: true, message: "Deleted successfully" }
//         );

//     } catch (error) {
//         return NextResponse.json(
//             { success: false, message: error.message },
//             { status: 500 }
//         );
//     }
// }


// Soft Delete


export async function DELETE(req, { params }) {
    try {
        await connectToDatabase();

        const { id } = await params; // ✅ correct way



        // 🔄 SOFT DELETE (instead of removing)
        const user = await User.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { returnDocument: 'after' }
        );

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "User deleted successfully (soft delete)",
        });

    } catch (error) {
        console.error("DELETE_USER_ERROR:", error);

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}