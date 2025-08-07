import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import Blog from "@/lib/models/BlogModel";

export async function GET(req, { params }) {
    try {
        await ConnectDB();
        const blog = await Blog.findById(params.id);
        if (!blog) {
            return NextResponse.json({ message: "Blog not found" }, { status: 404 });
        }
        return NextResponse.json(blog, { status: 200 });
    } catch (error) {
        console.error("Error fetching blog:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
