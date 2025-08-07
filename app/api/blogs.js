import dbConnect from '../../lib/config/db';
import BlogModel from '../../lib/models/BlogModel';
import { protectRoute } from '../../lib/middleware/protectRoute';

export default protectRoute(async (req, res) => {
  await dbConnect();

  if (req.method === 'POST') {
    const { title, content } = req.body;
    const blog = new BlogModel({ title, content, author: req.user.id });
    await blog.save();

    res.status(201).json(blog);
  }
});
