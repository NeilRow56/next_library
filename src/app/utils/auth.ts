import NextAuth, { DefaultSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import db from '@/lib/db'

declare module 'next-auth' {
  interface Session {
    user: {
      userId: number
      role?: string
    } & DefaultSession['user']
  }

  interface User {
    userId?: number
    role?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  debug: true,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async credentials => {
        let user = null

        user = await db.user.findUnique({
          where: {
            email: credentials.email as string
          }
        })

        if (!user) {
          throw new Error('Invalid credentials')
        } else {
          if (user.role === 'staff') {
            const passwordMatch = bcrypt.compare(
              credentials.password as string,
              user.password
            )

            console.log(passwordMatch)
            if (!passwordMatch) {
              throw new Error('Invalid credentials')
            }
          } else if (user.role === 'member') {
            if (user.libraryCardNo !== credentials.password) {
              throw new Error('Invalid credentials')
            }
          }
        }

        return user
      }
    })
  ],

  session: {
    strategy: 'jwt',
    //1 day
    maxAge: 24 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.userId
        token.email = user.email
        token.name = user.name
        token.role = user.role
      }

      return token
    },

    async session({ session, token }) {
      if (session) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
      }

      return session
    }
  },
  pages: {
    signIn: '/auth/signin'
  },
  basePath: '/auth'
})
