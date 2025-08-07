import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import UserModel from "@/lib/models/UserModel";

// ✅ Middleware for authentication (extract user ID)
async function getAuthenticatedUser(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return { error: "User not authenticated", status: 401 };
    }

    const user = await UserModel.findById(userId);
    if (!user) {
        return { error: "User not found", status: 404 };
    }

    return { user };
}
 
//✅ GET Request - Fetch Blogs
export async function GET(req) {
    try {
        await ConnectDB();
        const { searchParams } = new URL(req.url);
        const blogId = searchParams.get("id");

        let blogs;
        if (blogId) {
            blogs = await BlogModel.findById(blogId);
            if (!blogs) {
                return NextResponse.json({ error: "Blog not found" }, { status: 404 });
            }
        } else {
            blogs = await BlogModel.find();
        }

        return NextResponse.json(blogs);
    } catch (error) {
        console.error("❌ Error fetching blogs:", error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// ✅ POST Request - Add New Blog (no auth for admin)
export async function POST(req) {
    try {
        await ConnectDB();
        const formData = await req.formData();

        const title = formData.get("title");
        const description = formData.get("description");
        const category = formData.get("category");
        const author = formData.get("author"); // Now passed manually
        const authorImg = formData.get("authorImg");
        const imageFile = formData.get("image");

        if (!imageFile || imageFile.size === 0) {
            return NextResponse.json({ error: "Image is required" }, { status: 400 });
        }

        // Convert image to Base64
        const buffer = await imageFile.arrayBuffer();
        const base64Image = `data:${imageFile.type};base64,${Buffer.from(buffer).toString("base64")}`;

        const blog = new BlogModel({
            title,
            description,
            category,
            author,
            authorImg,
            image: base64Image,
        });

        await blog.save();

        return NextResponse.json({ success: true, msg: "Blog added successfully", blog }, { status: 201 });
    } catch (error) {
        console.error("❌ Error saving blog:", error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}



// ✅ DELETE Request - Remove Blog by ID (Admin Access)
export async function DELETE(req) {
    try {
        await ConnectDB();
        const { searchParams } = new URL(req.url);
        const blogId = searchParams.get("id");

        if (!blogId) {
            return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
        }

        const blog = await BlogModel.findById(blogId);
        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        await BlogModel.findByIdAndDelete(blogId);

        return NextResponse.json({ success: true, msg: "Blog deleted successfully by admin" }, { status: 200 });
    } catch (error) {
        console.error("❌ Error deleting blog:", error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


// ✅ PATCH Request - Like a Blog (Prevent Multiple Likes)
export async function PATCH(req) {
    try {
        await ConnectDB();
        const authResult = await getAuthenticatedUser(req);
        if (authResult.error) return NextResponse.json({ error: authResult.error }, { status: authResult.status });

        const { user } = authResult;
        const { searchParams } = new URL(req.url);
        const blogId = searchParams.get("id");

        if (!blogId) {
            return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
        }

        const blog = await BlogModel.findById(blogId);
        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        // Prevent multiple likes
        if (blog.likedBy && blog.likedBy.includes(user._id.toString())) {
            return NextResponse.json({ msg: "You have already liked this blog" }, { status: 200 });
        }

        blog.likes = (blog.likes || 0) + 1;
        blog.likedBy = [...(blog.likedBy || []), user._id.toString()];
        await blog.save();

        return NextResponse.json({ success: true, likes: blog.likes }, { status: 200 });
    } catch (error) {
        console.error("❌ Error updating likes:", error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// ✅ PUT Request - Save Blog to "Read Later" (Prevent Duplicates)
export async function PUT(req) {
    try {
        await ConnectDB();
        const authResult = await getAuthenticatedUser(req);
        if (authResult.error) return NextResponse.json({ error: authResult.error }, { status: authResult.status });

        const { user } = authResult;
        const { searchParams } = new URL(req.url);
        const blogId = searchParams.get("id");

        if (!blogId) {
            return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
        }

        const blog = await BlogModel.findById(blogId);
        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        // Prevent duplicate save
        if (blog.savedBy && blog.savedBy.includes(user._id.toString())) {
            return NextResponse.json({ msg: "Blog already saved!" }, { status: 200 });
        }

        blog.savedBy = [...(blog.savedBy || []), user._id.toString()];
        await blog.save();

        return NextResponse.json({ success: true, msg: "Blog saved to Read Later!", savedBy: blog.savedBy }, { status: 200 });
    } catch (error) {
        console.error("❌ Error saving blog:", error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
