import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { lineItems, successUrl, cancelUrl } = req.body as {
    lineItems: { price_data: any; quantity: number }[];
    successUrl: string;
    cancelUrl: string;
  };
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      save_payment_method: true
    });
    res.json({ id: session.id, url: session.url });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}