import { ConnectDB } from "@/lib/config/db"  // Adjust path as needed
import User from "../../../models/UserModel";
import bcrypt from "bcryptjs";

export const POST = async (req) => {// ✅ Use named export for API routes
    try {
        await ConnectDB();  // ✅ Correct function call

        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ message: "Email already registered" }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        return new Response(JSON.stringify({ message: "Registration successful" }), { status: 201 });
    } catch (error) {
        console.error("Registration Error:", error);
        return new Response(JSON.stringify({ message: "Server Error" }), { status: 500 });
    }
};
