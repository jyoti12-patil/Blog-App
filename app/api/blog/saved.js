import { ConnectDB } from '@/lib/config/db';
import Blog from '@/models/BlogModel';
import User from '@/models/UserModel';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
    await ConnectDB();
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = await User.findOne({ email: session.user.email }).populate('savedBlogs');
        res.status(200).json(user.savedBlogs);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
