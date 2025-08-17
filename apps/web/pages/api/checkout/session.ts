import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { items, successUrl, cancelUrl } = req.body as {
      items: { name: string; amount: number; currency: string; quantity: number }[];
      successUrl: string;
      cancelUrl: string;
    };

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((i) => ({
      quantity: i.quantity,
      price_data: {
        currency: i.currency,
        unit_amount: i.amount,
        product_data: { name: i.name }
      }
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_creation: 'if_required',
      payment_intent_data: { setup_future_usage: 'on_session' },
      success_url: successUrl,
      cancel_url: cancelUrl
    });

    res.json({ id: session.id, url: session.url });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}