// import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import connectionToDatabase from '@/lib/DB_CONNECTION'
// import User from "@/models/User";

// // POST /api/User/login
// export async function POST(req) {
//     try {
//         await connectionToDatabase();
//         const { email, password, name, phone } = await req.json();

//         if (!email || !password) {
//             return NextResponse.json(
//                 { success: false, message: "Email and password are required" },
//                 { status: 400 }
//             );
//         }

//         // Check if any User exists
//         const existingUsers = await User.find();

//         if (existingUsers.length === 0) {
//             // If no User exists, create the first one
//             const hashedPassword = await bcrypt.hash(password, 10);
//             const newUser = await User.create({
//                 name: name || "Super User",
//                 email,
//                 phone: phone || 0,
//                 password: hashedPassword,
//                 bio: "Super User Bio",
//                 photo: "",
//                 role: "User1",
//             });

//             // Generate token for new User
//             const token = jwt.sign(
//                 {
//                     id: newUser._id,
//                     mail: newUser.email,
//                     role: newUser.role
//                 },
//                 process.env.JWT_SECRET,
//                 { expiresIn: "1d" }
//             );

//             return NextResponse.json(
//                 {
//                     success: true,
//                     message: "User account created",
//                     token,
//                     User: { id: newUser._id, email: newUser.email, role: newUser.role },
//                 },
//                 { status: 201 }
//             );
//         }

//         // If User exists → login flow
//         const User = await User.findOne({ email });
//         if (!User) {
//             return NextResponse.json(
//                 { success: false, message: "User not found" },
//                 { status: 404 }
//             );
//         }

//         const isMatch = await bcrypt.compare(password, User.password);
//         if (!isMatch) {
//             return NextResponse.json(
//                 { success: false, message: "Invalid credentials" },
//                 { status: 401 }
//             );
//         }

//         // Generate token for login
//         const token = jwt.sign(
//             {
//                 id: User._id,
//                 role: User.role,
//                 mail: User.email,
//                 photo: User.photo,
//                 name: User.name,
//             },
//             process.env.JWT_SECRET,
//             { expiresIn: "1d" }
//         );

//         return NextResponse.json(
//             {
//                 success: true,
//                 message: "Login successful",
//                 token,
//                 User: { id: User._id, email: User.email, role: User.role },
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Login error:", error);
//         return NextResponse.json(
//             { success: false, message: "Server error" },
//             { status: 500 }
//         );
//     }
// }



import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectionToDatabase from "@/lib/DB_CONNECTION";
import User from "@/models/User";

// POST /api/user/login
export async function POST(req) {
    try {
        await connectionToDatabase();

        const { email, password, name, phone } = await req.json();

        // ✅ Validation
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required" },
                { status: 400 }
            );
        }

        // ✅ Check if any user exists (for first admin creation)
        const existingUser = await User.findOne();

        // 🟢 FIRST USER → CREATE ADMIN
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                name: name || "Admin",
                email,
                password: hashedPassword,
                phone: phone || "",
                role: "admin", // ✅ first user = admin
                employeeId: "EMP-001",
                designation: "Super Admin",
                joiningDate: new Date(),
            });

            const token = jwt.sign(
                {
                    id: newUser._id,
                    role: newUser.role,
                    email: newUser.email,
                },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            return NextResponse.json(
                {
                    success: true,
                    message: "Admin account created",
                    token,
                    user: {
                        id: newUser._id,
                        name: newUser.name,
                        email: newUser.email,
                        role: newUser.role,
                    },
                },
                { status: 201 }
            );
        }

        // 🔐 LOGIN FLOW
        const user = await User.findOne({ email }).populate("department");

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        if (user.status !== "active") {
            return NextResponse.json(
                { success: false, message: "User is inactive" },
                { status: 403 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // ✅ Generate Token (HRMS ready payload)
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                email: user.email,
                name: user.name,
                department: user.department?._id || null,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return NextResponse.json(
            {
                success: true,
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    employeeId: user.employeeId,
                    department: user.department,
                    designation: user.designation,
                },
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Login error:", error);

        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}