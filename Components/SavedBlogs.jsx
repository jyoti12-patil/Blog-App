import { useEffect, useState } from 'react';
import axios from 'axios';

const SavedBlogs = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchSavedBlogs = async () => {
            try {
                const response = await axios.get('/api/blog/saved');
                setBlogs(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchSavedBlogs();
    }, []);

    return (
        <div>
            <h2>Saved Blogs</h2>
            {blogs.length === 0 ? <p>No saved blogs yet.</p> : (
                blogs.map(blog => (
                    <div key={blog._id}>
                        <h3>{blog.title}</h3>
                        <p>{blog.content}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default SavedBlogs;
