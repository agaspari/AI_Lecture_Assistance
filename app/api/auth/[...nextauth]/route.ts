import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Define authOptions locally (do not export to satisfy Next.js Route requirements)
const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { email: credentials!.email }
                })

                if (!user || !(await bcrypt.compare(credentials!.password, user.password))) {
                    throw new Error('Invalid credentials')
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            }
        })
    ],

    session: { strategy: 'jwt' },

    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = (user as any).role
            return token
        },
        async session({ session, token }) {
            session.user!.role = token.role as string
            return session
        }
    },

    pages: {
        signIn: '/login'
    }
}

// Initialize the NextAuth handler
const handler = NextAuth(authOptions)

// Export only the HTTP methods for the Route
export { handler as GET, handler as POST }
