/**
 * NextAuth v4 configuration — single source of truth.
 * Import authOptions wherever getServerSession() is called.
 */

import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          select: {
            id: true,
            email: true,
            name: true,
            passwordHash: true,
            role: true,
            avatarUrl: true,
          },
        })

        if (!user?.passwordHash) return null

        const valid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!valid) return null

        return {
          id:       user.id,
          email:    user.email,
          name:     user.name,
          image:    user.avatarUrl ?? undefined,
          role:     user.role,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id
        token.role = (user as { role?: string }).role ?? 'USER'
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id   = token.id as string
        ;(session.user as { role?: string }).role = token.role as string
      }
      return session
    },
  },

  pages: {
    signIn:  '/auth/signin',
    signOut: '/auth/signout',
    error:   '/auth/signin',
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',
}
