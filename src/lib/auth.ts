import CredentialsProvider from "next-auth/providers/credentials"
import { DefaultSession, DefaultUser, Session } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import type { NextAuthOptions } from "next-auth"
import { OAuthConfig } from "next-auth/providers/oauth"

const prisma = new PrismaClient()

// Splitwise provider configuration
const SplitwiseProvider: OAuthConfig<any> = {
  id: "splitwise",
  name: "Splitwise",
  type: "oauth",
  version: "1.0",
  userinfo: "https://secure.splitwise.com/api/v3.0/get_current_user",
  profileUrl: "https://secure.splitwise.com/api/v3.0/get_current_user",
  requestTokenUrl: "https://secure.splitwise.com/oauth/request_token",
  accessTokenUrl: "https://secure.splitwise.com/oauth/access_token",
  authorization: "https://secure.splitwise.com/oauth/authorize",

  profile: (profile: any) => {
    return {
      id: profile.user.id,
      name: profile.user.first_name,
      email: profile.user.email,
    }
  },
  clientId: process.env.SPLITWISE_CLIENT_ID,
  clientSecret: process.env.SPLITWISE_CLIENT_SECRET,
}

export const NEXT_AUTH: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "name", type: "text", placeholder: "Enter your name" },
        email: {
          label: "email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "Set your password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Fetch user from the database
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
          select: { id: true, email: true, name: true, password: true },
        })

        // If user doesn't exist, create a new user
        if (!user) {
          const hashedPassword = await bcrypt.hash(credentials.password, 10)
          const newUser = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.name,
              password: hashedPassword,
            },
          })
          return newUser
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password!
        )
        if (!isValidPassword) {
          return null
        }
        return user
      },
    }),
    // Uncomment the following lines to enable Google provider
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID || "",
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    // }),
    SplitwiseProvider,
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // debug: true,
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        })

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: { email: profile.email, name: profile.name },
          })
          if (!newUser) {
            return false
          }
        }
      }
      if (account.provider === "splitwise") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        })

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              splitwiseUserId: JSON.stringify(user.id),
            },
          })
          if (!newUser) {
            return false
          }
        }
      }
      return true
    },
    async session({ session, token }: any) {
      if (session?.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
        })
        if (dbUser) {
          session.user.id = dbUser.id
          session.user.splitwiseUserId = dbUser.splitwiseUserId || null
        }
      }
      return session
    },
  },
}
