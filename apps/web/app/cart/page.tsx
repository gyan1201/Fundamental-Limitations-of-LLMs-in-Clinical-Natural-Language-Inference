"use client";

import { useEffect, useMemo, useState } from 'react';
import { useCartStore } from '@store/index';
import { supabase } from '../../lib/supabaseClient';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const remove = useCartStore((s) => s.removeItem);
  const [productsById, setProductsById] = useState<Record<string, any>>({});

  useEffect(() => {
    const ids = items.map((i) => i.productId);
    if (ids.length === 0) return setProductsById({});
    supabase.from('products').select('*').in('id', ids).then(({ data }) => {
      const map: Record<string, any> = {};
      (data ?? []).forEach((p) => { map[p.id] = p; });
      setProductsById(map);
    });
  }, [items]);

  const totalCents = useMemo(() => items.reduce((sum, i) => sum + (productsById[i.productId]?.price_cents ?? 0) * i.quantity, 0), [items, productsById]);

  const onCheckout = async () => {
    const payload = {
      items: items.map((i) => ({
        name: productsById[i.productId]?.title ?? 'Item',
        amount: productsById[i.productId]?.price_cents ?? 0,
        currency: 'usd',
        quantity: i.quantity
      })),
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`
    };
    const res = await fetch('/api/checkout/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <main>
      <h2 className="text-2xl font-semibold">Cart</h2>
      <ul className="mt-4 space-y-2">
        {items.map((i) => (
          <li key={i.productId} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{productsById[i.productId]?.title ?? 'Item'}</div>
              <div className="text-sm text-gray-600">Qty {i.quantity} · ${(productsById[i.productId]?.price_cents ? productsById[i.productId]?.price_cents / 100 : 0).toFixed(2)}</div>
            </div>
            <button className="text-red-600" onClick={() => remove(i.productId)}>Remove</button>
          </li>
        ))}
      </ul>
      <div className="mt-4 font-semibold">Total: ${(totalCents / 100).toFixed(2)}</div>
      <div className="flex gap-3 mt-4">
        <button className="px-4 py-2 rounded border" onClick={clear}>Clear</button>
        <button className="px-4 py-2 rounded bg-black text-white" onClick={onCheckout} disabled={items.length === 0}>Checkout</button>
      </div>
    </main>
  );
}