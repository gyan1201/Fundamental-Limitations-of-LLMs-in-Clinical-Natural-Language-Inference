import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return res.status(401).end();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
  if (profile?.role !== 'admin') return res.status(403).end();

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'POST') {
    const { title, price_cents, stock, image_url } = req.body;
    const { data, error } = await supabase.from('products').insert({ title, price_cents, stock, image_url }).select('*').single();
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query as { id: string };
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ ok: true });
  }

  return res.status(405).end();
}