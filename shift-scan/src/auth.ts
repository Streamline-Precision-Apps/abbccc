    import NextAuth, { type DefaultSession } from "next-auth";
    import Credentials from "next-auth/providers/credentials";
    import bcrypt from "bcryptjs";
    import { prisma } from "./lib/prisma";
    import { cookies } from "next/headers";
    import type { Provider } from "next-auth/providers";

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
        username: string;
        permission: string;
        firstName: string;
        lastName: string;
        truck_view: boolean;
        tasco_view: boolean;
        mechanic_view: boolean;
    }
    }

    const providers: Provider[] = [
    Credentials({
        credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        },
        authorize: async (credentials) => {
        // Your existing logic for authorization
        try {
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

            const isValidPassword = await bcrypt.compare(passwords, user.password);
            if (!isValidPassword) {
            throw new Error("Invalid password");
            }

            cookies().set("user", user.id, { httpOnly: true, secure: true });
            cookies().set("permission", user.permission, { httpOnly: true, secure: true });

            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            console.error(error);
            return null;
        }
        },
    }),
    ];

    export const providerMap = providers.map((provider) => {
    if (typeof provider === "function") {
        const providerData = provider();
        return { id: providerData.id, name: providerData.name };
    } else {
        return { id: provider.id, name: provider.name };
    }
    });

    export const { auth, handlers, signIn, signOut } = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers,
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
    pages: {
        signIn: "/signin", // Custom sign-in page
    },
    });