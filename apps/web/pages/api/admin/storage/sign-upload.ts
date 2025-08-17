import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const supabase = createPagesServerClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return res.status(401).end();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
  if (profile?.role !== 'admin') return res.status(403).end();

  const { filename } = req.body as { filename: string };
  if (!filename) return res.status(400).json({ error: 'filename required' });
  const path = `${Date.now()}_${filename}`;

  const { data, error } = await supabase.storage.from('product-images').createSignedUploadUrl(path);
  if (error || !data) return res.status(400).json({ error: error?.message || 'Failed to sign' });

  return res.json({ path, signedUrl: data.signedUrl, token: data.token });
}