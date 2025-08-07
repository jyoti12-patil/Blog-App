'use client';
import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onAuthenticate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // ✅ Show loading state

        try {
            await axios.post('/api/auth/login', { email, password });

            // ✅ Persist authentication
            localStorage.setItem('isAuthenticated', 'true');
            onAuthenticate(); // ✅ Close popup and unlock content
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false); // ✅ Hide loading state
        }
    };

    return (
        <form onSubmit={handleLogin} className='flex flex-col gap-4'>
            <input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='border p-2 rounded-md'
                required
            />
            <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='border p-2 rounded-md'
                required
            />
            <button
                type='submit'
                className='bg-green-500 text-white py-2 rounded-md hover:bg-green-600'
                disabled={loading} // ✅ Disable button while loading
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>

            {error && <p className='text-red-500'>{error}</p>}
        </form>
    );
};

export default LoginForm;
