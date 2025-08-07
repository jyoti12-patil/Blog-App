import jwt from "jsonwebtoken";
import cookie from "cookie";
import UserModel from "@/lib/models/UserModel";

async function getAuthenticatedUser(req) {
    const cookies = cookie.parse(req.headers.get("cookie") || "");
    const token = cookies.token;

    if (!token) {
        return { error: "Unauthorized", status: 401 };
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            return { error: "User not found", status: 404 };
        }

        return { user };
    } catch (err) {
        return { error: "Invalid token", status: 401 };
    }
}
