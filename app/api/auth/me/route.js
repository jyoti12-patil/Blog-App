import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import User from "@/app/models/UserModel";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function GET(req) {
    try {
        await ConnectDB();
        
        console.log("Cookies received:", req.cookies);
        
        const token = req.cookies.get("authToken")?.value;
        
        // If no token exists, force the client to remove the cookie
        if (!token) {
            const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            response.headers.append("Set-Cookie", serialize("authToken", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                expires: new Date(0), // Expire immediately
            }));
            return response;
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            // If token is invalid, expire the cookie
            const response = NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
            response.headers.append("Set-Cookie", serialize("authToken", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                expires: new Date(0), // Expire immediately
            }));
            return response;
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            const response = NextResponse.json({ error: "User not found" }, { status: 404 });
            response.headers.append("Set-Cookie", serialize("authToken", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                expires: new Date(0), // Expire immediately
            }));
            return response;
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error in /api/auth/me:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
