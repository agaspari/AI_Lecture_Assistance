import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            /** Your Prisma model’s `id` */
            id: string;
            /** The `role` you added in authorize() */
            role: string;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        /** Mirror your Prisma `User.role` field */
        role: string;
    }

    interface JWT {
        /** Persisted in your jwt callback */
        role: string;
    }
}