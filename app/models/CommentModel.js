import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
        blogId: { type: String, required: true },
        name: { type: String, required: true },
        comment: { type: String, required: true },
    },
    { timestamps: true }
);

const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
export default Comment;
