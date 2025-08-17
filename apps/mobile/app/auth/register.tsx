import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabaseClient';

export default function Register() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onRegister = async () => {
    setError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) {
      setError(error?.message ?? 'Registration failed');
      return;
    }
    await supabase.from('profiles').insert({ id: data.user.id, email, full_name: fullName });
    router.replace('/');
  };

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Create account</Text>
      <TextInput placeholder="Full name" onChangeText={setFullName} value={fullName} style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      <TextInput placeholder="Email" autoCapitalize="none" onChangeText={setEmail} value={email} style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button title="Register" onPress={onRegister} />
    </View>
  );
}