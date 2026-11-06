import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { palette } from '@/constants/palette';
import { SessionProvider } from '@/contexts/session-context';

export default function RootLayout() {
  return (
    <SessionProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          animation: 'fade_from_bottom',
          contentStyle: { backgroundColor: palette.background },
          headerShown: false,
        }}
      />
    </SessionProvider>
  );
}
