"use client";

import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onLogin = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else window.location.href = '/dashboard';
  };

  return (
    <main className="max-w-sm">
      <h2 className="text-2xl font-semibold">Login</h2>
      <div className="flex flex-col gap-3 mt-4">
        <input className="border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="px-4 py-2 rounded bg-black text-white" onClick={onLogin}>Login</button>
        <Link className="text-sm underline" href="/auth/register">Create account</Link>
      </div>
    </main>
  );
}