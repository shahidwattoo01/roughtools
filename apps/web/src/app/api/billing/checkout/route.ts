export const dynamic = 'force-dynamic'

/**
 * Billing Checkout Route
 *
 * Creates a Stripe checkout session for plan upgrades.
 * Requires STRIPE_SECRET_KEY and Stripe price IDs to be configured.
 *
 * Install Stripe: pnpm add stripe --filter @workspace/web
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Sign in to upgrade your plan.' }, { status: 401 })
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json(
      { message: 'Billing is not configured yet. Please contact support.' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json() as { plan?: string }
    const plan = body.plan ?? 'pro'

    const priceId =
      plan === 'pro'  ? process.env.STRIPE_PRICE_PRO  :
      plan === 'team' ? process.env.STRIPE_PRICE_TEAM :
      plan === 'api'  ? process.env.STRIPE_PRICE_API  :
      null

    if (!priceId) {
      return NextResponse.json({ message: `Unknown plan: ${plan}` }, { status: 400 })
    }

    // Dynamically import Stripe to avoid build errors when not installed
    const Stripe = (await import('stripe' as never) as { default: new (key: string, opts: object) => unknown }).default
    const stripe = new Stripe(stripeKey, { apiVersion: '2025-01-27.acacia' }) as {
      checkout: { sessions: { create: (opts: object) => Promise<{ url: string | null }> } }
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: session.user.email,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?upgraded=1`,
      cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      metadata: { userId: (session.user as { id?: string }).id ?? '', plan },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err) {
    console.error('[billing/checkout] error:', err)
    return NextResponse.json({ message: 'Failed to create checkout session.' }, { status: 500 })
  }
}
