"use client";

import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onRegister = async () => {
    setError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) {
      setError(error?.message ?? 'Registration failed');
      return;
    }
    await supabase.from('profiles').insert({ id: data.user.id, email, full_name: fullName });
    window.location.href = '/dashboard';
  };

  return (
    <main className="max-w-sm">
      <h2 className="text-2xl font-semibold">Create account</h2>
      <div className="flex flex-col gap-3 mt-4">
        <input className="border rounded px-3 py-2" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="px-4 py-2 rounded bg-black text-white" onClick={onRegister}>Register</button>
      </div>
    </main>
  );
}