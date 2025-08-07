'use client';
import React, { useState } from 'react';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

const Popup = ({ onAuthenticate, onClose }) => {
    const [showLogin, setShowLogin] = useState(false);
    const [showAuthForm, setShowAuthForm] = useState(false); // ✅ First show message, not form

    return (
        <div className='fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50'>
            <div className='bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center'>
                {!showAuthForm ? (
                    // ✅ Step 1: Show the message first
                    <>
                        <h2 className='text-2xl font-bold mb-4'>🔐 Access Restricted</h2>
                        <p className='text-gray-600 mb-6'>
                            You need to log in or register to view this content.
                        </p>
                        <button
                            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
                            onClick={() => setShowAuthForm(true)} // ✅ Show login/register on click
                        >
                            Continue to Register/Login
                        </button>
                        <button
                            className='mt-3 block text-gray-500 hover:underline'
                            onClick={onClose} // ✅ Allow closing the popup
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    // ✅ Step 2: Show login/register form
                    <>
                        {showLogin ? (
                            <LoginForm onAuthenticate={onAuthenticate} />
                        ) : (
                            <RegisterForm onAuthenticate={onAuthenticate} />
                        )}

                        <p className='mt-4 text-sm text-gray-600'>
                            {showLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                            <button
                                className='text-blue-500 hover:underline'
                                onClick={() => setShowLogin(!showLogin)}
                            >
                                {showLogin ? 'Register' : 'Login'}
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Popup;
