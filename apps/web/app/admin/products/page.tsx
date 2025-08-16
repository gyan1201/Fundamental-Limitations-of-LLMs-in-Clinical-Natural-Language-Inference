"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../../lib/supabaseClient';

type ProductForm = {
  title: string;
  priceCents: number;
  stock: number;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const { register, handleSubmit, reset } = useForm<ProductForm>();

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data ?? []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onCreate = async (values: ProductForm) => {
    await supabase.from('products').insert({ title: values.title, price_cents: values.priceCents, stock: values.stock });
    reset();
    fetchProducts();
  };

  return (
    <main style={{ padding: 32 }}>
      <h2>Products</h2>
      <form onSubmit={handleSubmit(onCreate)} style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <input placeholder="Title" {...register('title', { required: true })} />
        <input type="number" placeholder="Price (cents)" {...register('priceCents', { valueAsNumber: true })} />
        <input type="number" placeholder="Stock" {...register('stock', { valueAsNumber: true })} />
        <button type="submit">Create</button>
      </form>

      <ul style={{ marginTop: 24 }}>
        {products.map((p) => (
          <li key={p.id}>
            {p.title} - ${(p.price_cents / 100).toFixed(2)} - stock {p.stock}
          </li>
        ))}
      </ul>
    </main>
  );
}