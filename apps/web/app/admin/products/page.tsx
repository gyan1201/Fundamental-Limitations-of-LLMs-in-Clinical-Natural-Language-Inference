"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { ImageUpload } from '../../components/upload';

type ProductForm = {
  title: string;
  priceCents: number;
  stock: number;
  imageUrl?: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const { register, handleSubmit, reset, setValue } = useForm<ProductForm>();

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(data ?? []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onCreate = async (values: ProductForm) => {
    await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: values.title, price_cents: values.priceCents, stock: values.stock, image_url: values.imageUrl })
    });
    reset();
    fetchProducts();
  };

  const onDelete = async (id: string) => {
    await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  return (
    <main>
      <h2 className="text-2xl font-semibold">Products</h2>
      <form onSubmit={handleSubmit(onCreate)} className="flex gap-2 mt-4 items-center">
        <input className="border rounded px-3 py-2" placeholder="Title" {...register('title', { required: true })} />
        <input className="border rounded px-3 py-2 w-40" type="number" placeholder="Price (cents)" {...register('priceCents', { valueAsNumber: true })} />
        <input className="border rounded px-3 py-2 w-32" type="number" placeholder="Stock" {...register('stock', { valueAsNumber: true })} />
        <ImageUpload onUploaded={(url) => setValue('imageUrl', url)} />
        <button className="px-4 py-2 rounded bg-black text-white" type="submit">Create</button>
      </form>

      <ul className="mt-6 space-y-2">
        {products.map((p) => (
          <li key={p.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-gray-600">${(p.price_cents / 100).toFixed(2)} · stock {p.stock}</div>
            </div>
            <button className="text-red-600" onClick={() => onDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}