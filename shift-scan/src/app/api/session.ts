// pages/api/session.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route'; // Adjust the import path accordingly
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    return res.status(200).json(session.user);
}