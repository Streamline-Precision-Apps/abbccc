    import NextAuth, { type DefaultSession } from "next-auth";
    import { prisma } from "./lib/prisma";
    import Credentials from "next-auth/providers/credentials";
    import bcrypt from "bcryptjs";
    import { cookies } from "next/headers";

    declare module "next-auth" {
    interface Session {
    user: {
    id: string;
    permission: string;
    firstName: string;
    lastName: string;
    truck_view: boolean;
    tasco_view: boolean;
    mechanic_view: boolean;
    };
    }
    interface User {
    username: string; // Ensure username is a string
    permission: string;
    firstName: string;
    lastName: string;
    truck_view: boolean;
    tasco_view: boolean;
    mechanic_view: boolean;
    }
    }

    export const { auth, handlers} = NextAuth({
    session: {
    strategy: "jwt",
    },
    providers: [
    Credentials({
    credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        locale: {
                label: "Hablas Espanol?",
                type: "checkbox",
                value: "true"
            }
    },
    authorize: async (credentials) => {
        try {
            if (credentials?.locale === 'true') {
                cookies().set('locale', 'es', { path: '/' });
            } else {
                cookies().set('locale', 'en', { path: '/' });
            }

        const username = credentials?.username as string;
        const passwords = credentials?.password as string;
        
        if (!username || !passwords) {
            throw new Error("Username and password are required");
        }

        const user = await prisma.user.findUnique({
            where: { username: username },
        });

        if (!user || !user.password) {
            throw new Error("User not found");
        }

        // Ensure user.password is a string and compare it
        const isValidPassword = await bcrypt.compare(passwords, user.password);
        if (!isValidPassword) {
            throw new Error("Invalid password");
        }

        cookies().set("user", user.id, { httpOnly: true, secure: true });
        cookies().set("permission", user.permission, { httpOnly: true, secure: true });
        // Return the user object that matches the User type
        const { password, ...userWithoutPassword } = user;
        
        return userWithoutPassword;

        } catch (error) {
        console.error(error);
        return null;
        }
    },
    }),
    ],
    callbacks: {
    jwt: async ({ token, user }) => {
        if (user) {
        token.id = user.id;
        token.permission = user.permission;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.truck_view = user.truck_view;
        token.tasco_view = user.tasco_view;
        token.mechanic_view = user.mechanic_view;
        }
        return token;
    },
    session: async ({ session, token }) => {
        if (token) {
        session.user = {
            ...session.user,
            id: token.id as string,
            permission: token.permission as string,
            firstName: token.firstName as string,
            lastName: token.lastName as string,
            truck_view: token.truck_view as boolean,
            tasco_view: token.tasco_view as boolean,
            mechanic_view: token.mechanic_view as boolean,
            
        };
        }
        return session;
    },
    },

    });