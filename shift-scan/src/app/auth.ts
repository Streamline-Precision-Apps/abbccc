import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import LocaleCheckBox from '../../components/localeCheckBox';

const prisma = new PrismaClient();

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'sign in',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        locale: { label: "Hablas Espanol?", type: "checkbox", placeholder: "en" },
      },
      authorize: async (credentials) => {
        if (credentials) {
          const { username, password } = credentials;

          // Replace this with your actual authentication logic
          if (username === 'jsmith' && password === 'password') {
            return { id: '1', name: 'J Smith', email: 'jsmith@me.com' };
          } else {
            return null;
          }
        }
        return null;
      }
    })
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
});