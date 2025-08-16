import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../lib/notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Gadget Store' }} />
      <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
      <Stack.Screen name="auth/register" options={{ title: 'Register' }} />
    </Stack>
  );
}