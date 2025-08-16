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
    <main>
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p className="mt-2">Signed in as {email}</p>
      <div className="flex gap-3 mt-4">
        <button className="px-4 py-2 rounded border" onClick={onSignOut}>Sign out</button>
        <Link className="px-4 py-2 rounded bg-black text-white" href="/admin/products">Manage products</Link>
      </div>
    </main>
  );
}