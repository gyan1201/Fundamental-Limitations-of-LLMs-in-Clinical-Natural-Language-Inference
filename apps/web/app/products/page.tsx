"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { useCartStore } from '@store/index';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const addItem = useCartStore((s) => s.addItem);
  useEffect(() => {
    supabase.from('products').select('*').eq('active', true).then(({ data }) => setProducts(data ?? []));
  }, []);

  return (
    <main>
      <h2 className="text-2xl font-semibold">Products</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {products.map((p) => (
          <li key={p.id} className="border rounded p-4">
            <div className="font-medium">{p.title}</div>
            <div className="text-sm text-gray-600">${(p.price_cents / 100).toFixed(2)}</div>
            <button className="mt-3 px-3 py-2 rounded bg-black text-white" onClick={() => addItem(p.id, 1)}>Add to cart</button>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link href="/cart" className="px-4 py-2 rounded border">Go to cart</Link>
      </div>
    </main>
  );
}