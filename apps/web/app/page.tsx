import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <h1 className="text-3xl font-bold">Gadget Store</h1>
      <p className="text-gray-600 mt-2">Modern gadgets at great prices.</p>
      <div className="flex gap-4 mt-6">
        <Link href="/auth/login" className="px-4 py-2 rounded bg-black text-white">Login</Link>
        <Link href="/auth/register" className="px-4 py-2 rounded border">Register</Link>
      </div>
    </main>
  );
}