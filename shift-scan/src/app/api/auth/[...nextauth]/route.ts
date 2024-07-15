// the import here and why use them, next-auth is important for authentication and needs 
// a database to work/validate user information.

import prisma from "@/lib/prisma";
import NextAuth, { NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import {cookies} from "next/headers";

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
                },
                locale: {
                    label: "Hablas Espanol?",
                    type: "checkbox",
                    value: "true"
                }
            },
        async authorize(credentials) {
            if (credentials?.locale === 'true') {
                cookies().set('locale', 'es', { path: '/' });
            } else {
                cookies().set('locale', 'en', { path: '/' });
            }

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
            // add this cookie so the app know that the user is logged in and has acess to the app.
            if (user && user.password) {
                cookies().set('user', user.id, { path: '/' });
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
                    token: token.name,
                    firstName: token.firstName,
                    lastName: token.lastName,
                    permission: token.permission,
                    truck_view: token.truck_view,
                    tasco_view: token.tasco_view,
                    labor_view: token.labor_view,
                    mechanic_view: token.mechanic_view,
                    
            
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
                    name: u.username,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    permission: u.permission,
                    truck_view: u.truck_view,
                    tasco_view: u.tasco_view,
                    labor_view: u.labor_view,
                    mechanic_view: u.mechanic_view,
                }        
        }
        return token;
        }
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
