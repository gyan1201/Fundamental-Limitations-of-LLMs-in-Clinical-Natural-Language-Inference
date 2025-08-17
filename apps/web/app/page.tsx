"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';

export default function HomePage() {
  return (
    <main>
      <motion.h1 className="text-3xl font-bold" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        Gadget Store
      </motion.h1>
      <p className="text-gray-600 mt-2">Modern gadgets at great prices.</p>
      <div className="flex gap-4 mt-6">
        <Link href="/auth/login"><Button>Login</Button></Link>
        <Link href="/auth/register"><Button variant="outline">Register</Button></Link>
        <Link href="/products"><Button variant="outline">Browse products</Button></Link>
      </div>
    </main>
  );
}