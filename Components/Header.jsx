"use client"; // Ensure this file is a Client Component

import { assets } from "@/app/Assets/assets";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { toast } from "react-toastify";

const Header = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Handle loading state
  const router = useRouter(); // Initialize useRouter

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email!");
      return;
    }

    setLoading(true); // Show loading state

    try {
      const response = await axios.post("/api/email", { email });

      if (response.data.success) {
        toast.success("Subscribed successfully!");
        setEmail(""); // Reset input after success
      } else {
        toast.error("Subscription failed. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to subscribe. Try again later.");
    } finally {
      setLoading(false); // Remove loading state
    }
  };

  return (
    <div className="py-5 px-5 md:px-12 lg:px-28">
      <div className="flex justify-between items-center">
        <Image src={assets.logo} width={180} alt="Logo" className="w-[130px] sm:w-auto" />
      </div>

      <div className="text-center my-8">
        <h1 className="text-3xl sm:text-5xl font-medium">Latest Blogs</h1>
        <div className="mt-6 max-w-[740px] m-auto">
          <p className="mt-4 text-xs sm:text-base">
            As we explore new advancements, embracing change and continuous learning becomes the key to staying ahead in this ever-evolving landscape.
          </p>
        </div>

        {/* Subscription Form */}
        <form
          onSubmit={onSubmitHandler}
          className="flex justify-between max-w-[500px] scale-75 sm:scale-100 mx-auto mt-10 border border-black 
          shadow-[-7px_7px_0px_#000000] transition-all hover:shadow-none"
        >
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter your email"
            className="pl-4 outline-none w-full py-4"
            disabled={loading}
          />
          <button
            type="submit"
            className="border-l border-black py-4 px-4 sm:px-8 active:bg-gray-600 active:text-white 
            transition-all hover:bg-black hover:text-white disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;
