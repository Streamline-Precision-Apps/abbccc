    import NextAuth, { CredentialsSignin, type DefaultSession } from "next-auth";
    import Credentials from "next-auth/providers/credentials";
    import bcrypt from "bcryptjs";
    import { prisma } from "./lib/prisma";
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
        } & DefaultSession["user"];
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
class InvalidLoginError extends CredentialsSignin {
    constructor() {
        super("Invalid credentials", { code: "credentials" });
    }
    }

const providers: Provider[] = [
Credentials({
    credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
        console.log(credentials);
        if (!credentials?.username || !credentials?.password) {
            throw new InvalidLoginError();
        }
        const username = credentials?.username as string;
        const passwords = credentials?.password as string;

        // Replace this with your own authentication logic
        const user = await prisma.user.findUnique({
            where: { username: username },
        });

        if (!user || !user.password) {  
            throw new InvalidLoginError();
        }   

        const isValidPassword = await bcrypt.compare(
            passwords,
            user.password
        );
        if (!isValidPassword) {
            throw new InvalidLoginError();
        }
        const userwithoutpassword = {
            id: user.id,
            username: user.username,
            permission: user.permission,
            firstName: user.firstName,
            lastName: user.lastName,
            truck_view: user.truck_view,
            tasco_view: user.tasco_view,
            mechanic_view: user.mechanic_view,
        }
        return userwithoutpassword;
        },
    }),
    ];

    export const { auth, handlers, signIn, signOut } = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers,
    callbacks: {
        jwt: async ({ token, user }) => {
        if (user) {
            token.id = user.id as string;
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