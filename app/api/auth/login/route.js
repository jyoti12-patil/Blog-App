import { ConnectDB } from "@/lib/config/db";
import User from "@/app/models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export const POST = async (req) => {
    try {
        await ConnectDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ message: "Email and password are required" }), { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return new Response(JSON.stringify({ message: "Login successful", token }), {
            status: 200,
            headers: {
                "Set-Cookie": serialize("authToken", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/",
                    // ❌ Removed `maxAge: 3600` → Makes it a session cookie
                }),
            },
        });
    } catch (error) {
        console.error("Login API Error:", error);
        return new Response(JSON.stringify({ message: "Server error", error: error.message }), { status: 500 });
    }
};
