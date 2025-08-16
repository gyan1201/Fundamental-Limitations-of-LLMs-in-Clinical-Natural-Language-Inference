import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: 32 }}>
      <h1>Gadget Store</h1>
      <p>Modern gadgets at great prices.</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/register">Register</Link>
      </div>
    </main>
  );
}