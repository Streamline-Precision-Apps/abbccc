// the import here and why use them, next-auth is important for authentication and needs 
// a database to work/validate user information.

import prisma from "@/lib/prisma";
import NextAuth, { NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import { User } from "@prisma/client";

export const authOptions : NextAuthOptions ={
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {
                    label: "Username",
                    type: "text", 
                    placeholder: "Your User Name" 
                },
                password: {
                    label: "Password",
                    type: "password" 
                }
            },
        async authorize(credentials) {
            // Add logic here to look up the user from the credentials supplied
            if (!credentials?.username || !credentials?.password) {
                return null
            }

            const user = await prisma.user.findUnique({
                where: {
                    username: credentials.username
                }
            })

            if(!user) {
                return null
            };

            // we need to check if the password is correct using bcrypt
            const isPasswordCorrect = await bcrypt.compare(
                credentials.password,
                user.password
            );

            if (!isPasswordCorrect) 
                {
                    return null
                }

            // authorization was successful
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        })    
    ], 
    callbacks: {
        session:({session, token})=>
        {
            console.log('Session callback', {session, token});
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    firstName: token.firstName,
                    lastName: token.lastName,
                    userName: token.username,
                    permission: token.permission,
                    truck_view: token.truck_view,
                    tasco_view: token.tasco_view,
                    labor_view: token.labor_view,
                    mechanic_view: token.mechanic_view,
                    email: token.email,
                    phone: token.phone,
                    
            
                }
            }
        },
        jwt: ({token, user})=> {
            console.log('Jwt callback', { token, user});
            if(user)
            {
                const u = user as User;
                // allows the session to have the 
                return {
                    ...token,
                    id: u.id,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    userName: u.username,
                    permission: u.permission,
                    truck_view: u.truck_view,
                    tasco_view: u.tasco_view,
                    labor_view: u.labor_view,
                    mechanic_view: u.mechanic_view,
                    email: u.email,
                    phone: u.phone,
                }        
        }
        return token;
        }
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
