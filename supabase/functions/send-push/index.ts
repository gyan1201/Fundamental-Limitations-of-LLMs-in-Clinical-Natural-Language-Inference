import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  try {
    const { user_id, title, body, data } = await req.json();
    if (!user_id || !title || !body) {
      return new Response(JSON.stringify({ error: 'user_id, title, body required' }), { status: 400 });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const tokensRes = await fetch(`${supabaseUrl}/rest/v1/push_tokens?user_id=eq.${user_id}`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    if (!tokensRes.ok) {
      return new Response(await tokensRes.text(), { status: 500 });
    }
    const tokens = await tokensRes.json() as { token: string }[];
    if (tokens.length === 0) return new Response(JSON.stringify({ ok: true, sent: 0 }), { status: 200 });

    const messages = tokens.map((t) => ({ to: t.token, title, body, data }));
    const expoRes = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messages)
    });

    const expoTxt = await expoRes.text();
    return new Response(expoTxt, { status: expoRes.status });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});