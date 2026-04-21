// import jwt from "jsonwebtoken";

// export function getUserFromToken(req) {
//     try {
//         // 🔥 MUST BE lowercase
//         const authHeader = req.headers.get("authorization");

//         console.log("AUTH HEADER:", authHeader);

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return null;
//         }

//         const token = authHeader.split(" ")[1];

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         console.log("DECODED USER:", decoded);

//         return decoded;
//     } catch (err) {
//         console.log("TOKEN ERROR:", err.message);
//         return null;
//     }
// }

import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/DB_CONNECTION";
import User from "@/models/User";

export async function getUserFromToken(req) {
    try {
        await connectToDatabase();

        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        const token = authHeader.split(" ")[1];

        // 🔐 VERIFY TOKEN
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.id || !mongoose.Types.ObjectId.isValid(decoded.id)) {
            return null;
        }

        // 🔍 FIND USER
        const user = await User.findById(decoded.id);

        if (!user) return null;

        // ❌ BLOCK INACTIVE / DELETED USERS
        if (user.isDeleted || user.isActive === false) {
            return null;
        }

        // 🧠 CLEAN SAFE USER OBJECT
        const userObj = user.toObject();

        const safeUser = {
            id: userObj._id.toString(),
            name: userObj.name,
            email: userObj.email,
            department: userObj.department,
            role: userObj.role,
            isActive: userObj.isActive,
            isDeleted: userObj.isDeleted,
            createdAt: userObj.createdAt,
            updatedAt: userObj.updatedAt,
        };

        return safeUser;

    } catch (err) {
        console.log("TOKEN ERROR:", err.message);
        return null;
    }
}