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
    <main style={{ padding: 32 }}>
      <h2>Create account</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
        <input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={onRegister}>Register</button>
      </div>
    </main>
  );
}