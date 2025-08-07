import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    authorImg: { type: String, required: true },
    image: { type: String, required: true }, 
   
      
    date: { type: Date, default: Date.now },
    likes: {
        type: Number,
        default: 0,
      },
      likedBy: [String],
      savedBy: [String],
});

const BlogModel = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default BlogModel;
