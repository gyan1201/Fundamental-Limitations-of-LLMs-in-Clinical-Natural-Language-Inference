import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { supabase } from './supabaseClient';

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) return null;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  const { data: session } = await supabase.auth.getSession();
  if (session.session) {
    await supabase.from('push_tokens').upsert({ user_id: session.session.user.id, token });
  }
  return token;
}