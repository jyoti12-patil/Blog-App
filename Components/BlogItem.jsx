import { assets } from '@/app/Assets/assets';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';

const BlogItem = ({ id, title, description, category, image, initialLikes = 0, userId }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [saved, setSaved] = useState(false);
  const [isReading, setIsReading] = useState(false);
  let speech = null;

  // ✅ Handle Like Blog
  const handleLike = async () => {
    try {
      const res = await axios.patch(`/api/blog?id=${id}`);
      setLikes(res.data.likes || likes);
    } catch (error) {
      console.error("❌ Error liking blog:", error);
    }
  };

  // ✅ Handle Save Blog
  const handleSave = async () => {
    try {
      const res = await axios.put(`/api/blog?id=${id}&userId=${userId}`);
      if (res.data.success) setSaved(true);
    } catch (error) {
      console.error("❌ Error saving blog:", error);
    }
  };

  // ✅ Handle Read Aloud (Text-to-Speech)
  const handleReadAloud = () => {
    if (!isReading) {
      speech = new SpeechSynthesisUtterance(description);
      window.speechSynthesis.speak(speech);
      setIsReading(true);

      speech.onend = () => setIsReading(false); // Reset when speech ends
    } else {
      window.speechSynthesis.cancel();
      setIsReading(false);
    }
  };

  return (
    <div className="max-w-[330px] sm:max-w-[300px] bg-white border border-black hover:shadow-[-7px_7px_0px_#000000] transition-shadow duration-300">
      <Link href={`/blogs/${id}`}>
        <Image src={image} alt={title} width={400} height={400} className="border-b border-black" />
      </Link>
      <p className="ml-5 mt-5 px-1 inline-block bg-black text-white text-sm">{category}</p>
      <div className="p-5">
        <h5 className="mb-2 text-lg font-medium tracking-tight text-gray-900">{title}</h5>
        <p className="mb-3 text-sm tracking-tight text-gray-700"
           dangerouslySetInnerHTML={{ __html: description.slice(0, 120) + '...' }}>
        </p>
        <div className="flex items-center justify-between mt-4">
  {/* Read More Button */}
  <Link href={`/blogs/${id}`} className="text-sm font-semibold flex items-center">
    Read more <Image src={assets.arrow} className="ml-2" alt="arrow" width={12} />
  </Link>

  {/* Icons Container */}
  <div className="flex items-center space-x-4">
    {/* ❤️ Like Button */}
    <button 
      onClick={handleLike} 
      className="flex items-center space-x-1 text-red-500 font-semibold hover:scale-110 transition-transform duration-200">
      <span className="text-xl">❤️</span> 
      <span className="text-sm">{likes}</span>
    </button>

    {/* 📌 Save Button */}
    <button 
      onClick={handleSave} 
      disabled={saved} 
      className={`flex items-center space-x-1 font-semibold ${
        saved ? "text-gray-500" : "text-blue-500"
      } hover:scale-110 transition-transform duration-200`}>
      <span className="text-xl">📌</span> 
      <span className="text-sm">{saved ? "Saved" : "Save"}</span>
    </button>

    {/* 🔊 Read Aloud Button */}
    <button 
      onClick={handleReadAloud} 
      className="flex items-center space-x-1 text-green-500 font-semibold hover:scale-110 transition-transform duration-200">
      <span className="text-xl">🔊</span> 
      <span className="text-sm">{isReading ? "Stop" : "Read"}</span>
    </button>
  </div>
</div>


      </div>
    </div>
  );
};

export default BlogItem;
