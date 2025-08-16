import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { Text, View, Button } from 'react-native';
import { supabase } from '../lib/supabaseClient';

export default function HomeScreen() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
  }, []);

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Gadget Store</Text>
      <Text>{email ? `Signed in as ${email}` : 'You are not signed in'}</Text>
      <View style={{ height: 12 }} />
      {!email && <Link href="/auth/login">Login</Link>}
    </View>
  );
}