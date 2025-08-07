import { assets } from '@/app/Assets/assets';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Sidebar = () => {
  return (
    <div className='flex h-screen'>
      {/* Sidebar */}
      <div className='w-60 sm:w-80 bg-slate-100 h-full border-r-2 border-black flex flex-col items-center py-6'>
        
        {/* Logo */}
        <div className='flex flex-col items-center border-b-2 border-black w-full pb-4'>
          <Image src={assets.logo} width={100} height={100} alt='Logo' />
          <span className="mt-2 text-lg font-semibold">blogger</span>
        </div>

        {/* Buttons */}
        <div className='mt-8 w-11/12 flex flex-col gap-4'>
          <Link href='/admin/addProduct' className='flex items-center border-2 border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000] hover:bg-gray-200 cursor-pointer'>
            <Image src={assets.add_icon} alt='Add' width={24} height={24} />
            <p>Add blogs</p>
          </Link>

          <Link href='/admin/blogList' className='flex items-center border-2 border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000] hover:bg-gray-200 cursor-pointer'>
            <Image src={assets.blog_icon} alt='Blogs' width={24} height={24} />
            <p>Blog lists</p>
          </Link>

          <Link href='/admin/subscriptions' className='flex items-center border-2 border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000] hover:bg-gray-200 cursor-pointer'>
            <Image src={assets.email_icon} alt='Mail' width={24} height={24} />
            <p>Subscriptions</p>
          </Link>
        </div>

      </div>

      {/* Main Content Area */}
      <div className='flex-1 bg-white'></div>
    </div>
  );
};

export default Sidebar;
