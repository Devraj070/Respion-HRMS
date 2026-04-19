import jwt from "jsonwebtoken";

export function getUserFromToken(req) {
    try {
        // 🔥 MUST BE lowercase
        const authHeader = req.headers.get("authorization");

        console.log("AUTH HEADER:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("DECODED USER:", decoded);

        return decoded;
    } catch (err) {
        console.log("TOKEN ERROR:", err.message);
        return null;
    }
}