"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        window.location.href = '/auth/login';
        return;
      }
      setEmail(data.session.user.email ?? null);
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.session.user.id).single();
      setRole(profile?.role ?? null);
      const { data: notes } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(10);
      setNotifications(notes ?? []);

      const channel = supabase
        .channel('notifications')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${data.session.user.id}` }, (payload) => {
          setNotifications((prev) => [payload.new, ...prev].slice(0, 10));
        })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
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
        {role === 'admin' && <Link className="px-4 py-2 rounded bg-black text-white" href="/admin/products">Manage products</Link>}
        <Link className="px-4 py-2 rounded border" href="/products">Browse</Link>
      </div>

      <div className="mt-8">
        <h3 className="font-medium">Notifications</h3>
        <ul className="mt-2 space-y-2">
          {notifications.map((n) => (
            <li key={n.id} className="text-sm text-gray-700">[{new Date(n.created_at).toLocaleTimeString()}] {n.type}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}