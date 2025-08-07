import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import Comment from "@/app/models/CommentModel";

export async function GET(req) {
    try {
        await ConnectDB();
        const { searchParams } = new URL(req.url);
        const blogId = searchParams.get("blogId");

        if (!blogId) {
            return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
        }

        const comments = await Comment.find({ blogId }).sort({ createdAt: -1 });
        return NextResponse.json(comments);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await ConnectDB();
        const { blogId, name, comment } = await req.json();

        if (!blogId || !name || !comment) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const newComment = new Comment({ blogId, name, comment });
        await newComment.save();

        return NextResponse.json({ message: "Comment added successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
    }
}
