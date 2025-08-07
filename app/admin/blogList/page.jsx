'use client'
import BlogTableItem from '@/Components/AdminComponents/BlogTableItem'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('/api/blog');
      setBlogs(response.data); // Assuming your API returns an array directly
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs.");
    }
  };

  const deleteBlog = async (mongoId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
        const response = await axios.delete('/api/blog', {
            params: { id: mongoId }
        });

        if (response.status === 200) {
            toast.success(response.data.msg || "Blog deleted successfully");
            fetchBlogs(); // Reload the blog list
        } else {
            toast.error(response.data.error || "Failed to delete blog");
        }
    } catch (error) {
        console.error("Error deleting blog:", error);
        toast.error(error.response?.data?.error || "Failed to delete blog.");
    }
};

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className='flex-1 pt-5 sm:pt-12 sm:pl-16'>
      <h1>All Blogs</h1>
      <div className='relative h-[80vh] max-w-[850px] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide'>
        <table className='w-full text-sm text-gray-700'>
          <thead className='text-sm text-gray-700 text-left uppercase bg-gray-100'>
            <tr>
              <th scope='col' className='hidden sm:table-cell px-6 py-3'>Author Name</th>
              <th scope='col' className='px-6 py-4'>Blog Title</th>
              <th scope='col' className='px-6 py-4'>Date</th>
              <th scope='col' className='px-6 py-4'>Action</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length > 0 ? (
              blogs.map((item, index) => (
                <BlogTableItem
                  key={index}
                  mongoId={item._id}
                  title={item.title}
                  author={item.author}
                  authorImg={item.autor_img} // Fixed typo
                  date={item.date}
                  deleteBlog={deleteBlog}
                />
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">No blogs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogListPage;
