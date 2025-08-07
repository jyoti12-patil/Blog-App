'use client';
import { assets } from "@/app/Assets/assets";
import Footer from "@/Components/Footer";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Popup from "@/Components/Popup";

const Page = () => {
    const params = useParams();
    const [data, setData] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showPopup, setShowPopup] = useState(false); 
    const [userName, setUserName] = useState(""); // ✅ Track the entered name

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get("/api/auth/me");
                setIsAuthenticated(true);
                console.log("User is authenticated");
            } catch (error) {
                console.error("Authentication error:", error.response?.data || error.message);
                setShowPopup(true);
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated && params.id) {
            fetchBlogData();
            fetchComments();
        }
    }, [isAuthenticated, params.id]);

    const fetchBlogData = async () => {
        try {
            const response = await axios.get(`/api/blog?id=${params.id}`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching blog data:", error.response?.data || error.message);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/api/comments?blogId=${params.id}`);
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;

        try {
            await axios.post(`/api/comments`, {
                blogId: params.id,
                name: userName, // Get from state
                comment: newComment,
            });
            
            setNewComment(""); // Clear input
            fetchComments(); // Refresh comments
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    return (
        <>
            {/* ✅ Show popup only if user is not authenticated */}
            {showPopup && (
                <Popup 
                    onAuthenticate={() => {
                        setIsAuthenticated(true);
                        setShowPopup(false);
                        fetchBlogData();
                        fetchComments();
                    }} 
                    onClose={() => setShowPopup(false)} 
                />
            )}

            {/* ✅ Show blog content if authenticated and data is available */}
            {isAuthenticated && data ? (
                <div className='bg-gray-200 py-5 px-5 md:px-12 lg:px-28'>
                    <div className='flex justify-between items-center'>
                        <Link href='/'>
                            <Image src={assets.logo} width={180} alt='Logo' className='w-[130px] sm:w-auto' />
                        </Link>
                    </div>

                    <div className='text-center my-24'>
                        <h1 className='text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto'>{data.title}</h1>
                        <Image className='mx-auto mt-6 border border-white rounded-full' src='/autor_img.png' width={60} height={60} alt='Author' />
                        <p className='mt-1 pb-2 text-lg max-w-[740px] mx-auto'>{data.author}</p>
                    </div>

                    <div className='mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10'>
                        <Image className='border-4 border-white' src={data.image} width={1280} height={720} alt='Blog Cover' />
                        <div className='blog-content' dangerouslySetInnerHTML={{ __html: data.description }}></div>
                    </div>

                    {/* ✅ Comment Section */}
                    <div className='max-w-[800px] mx-auto bg-white p-5 rounded shadow-md'>
                        <h2 className='text-xl font-semibold mb-4'>Comments</h2>

                        {/* ✅ Input Field for Adding Comments */}
                        {/* ✅ Input Field for Adding Comments */}
    {/* ✅ Input Fields for Name & Comment */}
{isAuthenticated && (
    <div className="mb-4">
        <input 
            type="text"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 mb-3"
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
        />
        <textarea 
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300" 
            placeholder="Write your comment..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
        />
        <button 
            className="mt-2 px-5 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            onClick={handleCommentSubmit}
        >
            Submit Comment
        </button>
    </div>
)}



                        {/* ✅ Display Comments */}
                        {comments.length > 0 ? (
    comments.map((comment, index) => (
        <div key={index} className='border-b pb-3 mb-3'>
            <p className='font-semibold text-black'>{comment.name}</p> {/* ✅ Display User's Name */}
            <p className='text-gray-600'>{comment.comment}</p>
        </div>
    ))
) : (
    <p className='text-gray-500'>No comments yet.</p>
)}

</div>

                    {/* ✅ Fix Footer Spacing */}
                    <div className='mt-25'>
                        <Footer />
                    </div>
                </div>
            ) : (
                !showPopup && <p className='text-center mt-20 text-xl font-semibold'>Loading blog...</p>
            )}
        </>
    );
};

export default Page;
