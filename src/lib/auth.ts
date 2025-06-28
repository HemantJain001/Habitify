import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user || !user.password) {
                    return null
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id.toString(), // Ensure id is a string
                    email: user.email,
                    name: user.name,
                    image: user.image,
                }
            }
        })
    ],
    callbacks: {
        session: async ({ session, token }) => {
            if (session?.user && token?.sub) {
                session.user.id = token.sub
            }
            return session
        },
        jwt: async ({ user, token }) => {
            if (user) {
                token.sub = user.id // Use token.sub instead of token.uid
            }
            return token
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/signin",
        // Remove signUp as it's not a standard NextAuth page
    },
}
