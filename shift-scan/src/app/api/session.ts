// pages/api/session.js
import { getSession } from 'next-auth/react';

declare module 'next-auth' {
    interface Session {
        token: {
            email: string;
            picture: string;
            sub: string;
            id: string;
            firstName: string;
            lastName: string;
            truck_view: boolean;
            tasco_view: boolean;
            labor_view: boolean;
            mechanic_view: boolean;
            phone: string;
            iat: number;
            exp: number;
            jti: string;
        };
    }
}
export default async function handler(req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; email?: string; firstName?: string; lastName?: string; picture?: string; truck_view?: boolean; tasco_view?: boolean; labor_view?: boolean; mechanic_view?: boolean; phone?: string; }): void; new(): any; }; }; }) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Extract the necessary data from the session token
    const userData = {
        email: session.token.email,
        firstName: session.token.firstName,
        lastName: session.token.lastName,
        picture: session.token.picture,
        truck_view: session.token.truck_view,
        tasco_view: session.token.tasco_view,
        labor_view: session.token.labor_view,
        mechanic_view: session.token.mechanic_view,
        phone: session.token.phone,
    };

    res.status(200).json(userData);
}