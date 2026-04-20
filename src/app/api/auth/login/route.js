import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectionToDatabase from "@/lib/DB_CONNECTION";
import User from "@/models/User";
import "@/models/Department";

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