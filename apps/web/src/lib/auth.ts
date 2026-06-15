/**
 * NextAuth v4 configuration — single source of truth.
 * Import authOptions wherever getServerSession() is called.
 */

import type { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import TwitterProvider from 'next-auth/providers/twitter'
import LinkedInProvider from 'next-auth/providers/linkedin'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

async function generateUsername(base: string): Promise<string> {
  const clean = base.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20) || 'user'
  let candidate = clean
  for (let i = 0; i < 10; i++) {
    const exists = await prisma.user.findUnique({ where: { username: candidate }, select: { id: true } })
    if (!exists) return candidate
    candidate = `${clean}${Math.floor(1000 + Math.random() * 9000)}`
  }
  return `${clean}${Date.now().toString(36)}`
}

async function upsertOAuthUser(user: User): Promise<boolean> {
  if (!user.email) return false
  const existing = await prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true },
  })
  if (!existing) {
    const username = await generateUsername(user.name ?? user.email.split('@')[0])
    await prisma.user.create({
      data: {
        email: user.email,
        name: user.name ?? null,
        username,
        avatarUrl: user.image ?? null,
        emailVerified: true,
        isActive: true,
      },
    })
  } else {
    await prisma.user.update({
      where: { email: user.email },
      data: {
        lastLoginAt: new Date(),
        ...(user.image ? { avatarUrl: user.image } : {}),
      },
    })
  }
  return true
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '',
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID ?? '',
      clientSecret: process.env.TWITTER_CLIENT_SECRET ?? '',
      version: '2.0',
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID ?? '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? '',
    }),
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
          id:    user.id,
          email: user.email,
          name:  user.name,
          image: user.avatarUrl ?? undefined,
          role:  user.role,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.type === 'oauth') {
        return upsertOAuthUser(user)
      }
      return true
    },

    async jwt({ token, user, account }) {
      if (user) {
        if (account?.type === 'oauth') {
          // Look up our internal DB ID — OAuth user.id is the provider's ID, not ours
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: { id: true, role: true },
          })
          token.id   = dbUser?.id ?? user.id
          token.role = dbUser?.role ?? 'USER'
        } else {
          token.id   = user.id
          token.role = (user as { role?: string }).role ?? 'USER'
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id     = token.id as string
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
