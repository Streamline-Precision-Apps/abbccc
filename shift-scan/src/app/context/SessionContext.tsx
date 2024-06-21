
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export interface IUser {
    firstName: string;
    lastName: string;
    payPeriodHours: number;
    date: string;
    permission: string;
}

export interface ISessionContext {
    user: IUser;
    status: 'authenticated' | 'unauthenticated' | 'loading';
}

const SessionContext = createContext<ISessionContext | null>(null);

export const useSessionContext = () => useContext(SessionContext);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session } = useSession<{ user: ISessionContext }>();
    const router = useRouter();
    const [user, setUser] = useState<IUser>({
        firstName: 'Display Name',
        lastName: '',
        payPeriodHours: 0,
        date: 'display date',
        permission: '',
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');  // Redirect to login if not authenticated
        }

        if (session && session.user) {
            setUser({
                firstName: session.user.firstName || 'Display Name',
                lastName: session.user.lastName || '',
                payPeriodHours: 0,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                permission: session.user.permission || '',
            });
        }
    }, [session, status, router]);

    return (
        <SessionContext.Provider value={{ user, status }}>
            {children}
        </SessionContext.Provider>
    );
};