"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) window.location.href = '/auth/login';
      else setEmail(data.session.user.email ?? null);
    });
  }, []);

  const onSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <main style={{ padding: 32 }}>
      <h2>Dashboard</h2>
      <p>Signed in as {email}</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <button onClick={onSignOut}>Sign out</button>
        <Link href="/admin/products">Manage products</Link>
      </div>
    </main>
  );
}