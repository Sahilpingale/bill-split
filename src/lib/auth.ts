import CredentialsProvider from "next-auth/providers/credentials"
import { DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const NEXT_AUTH = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "" },
        password: { label: "password", type: "password", placeholder: "" },
      },
      async authorize(credentials: any) {
        // validation here
        return {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: async ({ session }: { session: DefaultSession }) => {
      return { ...session, id: "1" }
    },
  },
}
