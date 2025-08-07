import axios from 'axios';
import { useState } from 'react';

export default function RegisterForm({ onAuthenticate }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true); // ✅ Show loading state

        try {
            const response = await axios.post('/api/auth/register', {
                name,
                email,
                password
            });

            setSuccess(response.data.message);

            // ✅ Auto-login after successful registration
            await axios.post('/api/auth/login', { email, password });

            // ✅ Update authentication state in parent component
            localStorage.setItem('isAuthenticated', 'true');
            onAuthenticate(); // ✅ Close popup and unlock content
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false); // ✅ Hide loading state
        }
    };

    return (
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border p-2 rounded"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border p-2 rounded"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border p-2 rounded"
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                disabled={loading} // ✅ Disable button while submitting
            >
                {loading ? 'Registering...' : 'Register'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
        </form>
    );
}
