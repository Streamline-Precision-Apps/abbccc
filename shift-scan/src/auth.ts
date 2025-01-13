import NextAuth, { CredentialsSignin, type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import Resend from "next-auth/providers/resend";
// import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import type { Provider } from "next-auth/providers";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      permission: string;
      firstName: string;
      lastName: string;
      truckView: boolean;
      tascoView: boolean;
      mechanicView: boolean;
      laborView: boolean;
      accountSetup: boolean; // Add accountSetup to Session
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
    permission: string;
    firstName: string;
    lastName: string;
    truckView: boolean;
    tascoView: boolean;
    laborView: boolean;
    mechanicView: boolean;
    accountSetup: boolean; // Add accountSetup to User
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
      if (!credentials?.username || !credentials?.password) {
        throw new InvalidLoginError();
      }
      const username = credentials?.username as string;
      const passwords = credentials?.password as string;

      // Replace this with your own authentication logic
      const user = await prisma.user.findUnique({
        where: { username: username },
      });
      console.log(user?.password);

      if (!user || !user.password) {
        console.log("User not found or password not found");
        throw new InvalidLoginError();
      }

      const isValidPassword = () => {
        if (user.password === passwords) {
          return true;
        } else {
          return false;
        }
      };
      if (!isValidPassword) {
        console.log("Invalid password");
        throw new InvalidLoginError();
      }

      // const isValidPassword = await bcrypt.compare(passwords, user.password);
      // if (!isValidPassword) {
      //   console.log("Invalid password");
      //   throw new InvalidLoginError();
      // }

      const userwithoutpassword = {
        id: user.id,
        username: user.username,
        permission: user.permission,
        firstName: user.firstName,
        lastName: user.lastName,
        truckView: user.truckView,
        tascoView: user.tascoView,
        laborView: user.laborView,
        mechanicView: user.mechanicView,
        accountSetup: user.accountSetup, // Include accountSetup from user
      };

      return userwithoutpassword;
    },
  }),
];

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers,
  // trustHost: true,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token = {
          ...token,
          id: user.id,
          permission: user.permission,
          firstName: user.firstName,
          lastName: user.lastName,
          truckView: user.truckView,
          tascoView: user.tascoView,
          laborView: user.laborView,
          mechanicView: user.mechanicView,
          accountSetup: user.accountSetup,
        };
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
          truckView: token.truckView as boolean,
          tascoView: token.tascoView as boolean,
          laborView: token.laborView as boolean,
          mechanicView: token.mechanicView as boolean,
          accountSetup: token.accountSetup as boolean, // Add accountSetup to session
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin", // Custom sign-in page
  },
});
