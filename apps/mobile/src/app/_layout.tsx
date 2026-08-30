import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts as useSora, Sora_600SemiBold, Sora_700Bold } from '@expo-google-fonts/sora';
import { useFonts as useInter, Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';

import OfflineBanner from '@/components/common/OfflineBanner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ThemeProvider, useHomeTheme } from '@/context/ThemeContext';
import { useAuthStore } from '@/store/useAuthStore';

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const { colors } = useHomeTheme();

  return (
    <>
      <OfflineBanner />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  const [soraLoaded] = useSora({ Sora_600SemiBold, Sora_700Bold });
  const [interLoaded] = useInter({ Inter_400Regular, Inter_500Medium });
  const [isStoreHydrated, setIsStoreHydrated] = useState(false);

  const fontsReady = soraLoaded && interLoaded;

  useEffect(() => {
    const unsub = useAuthStore.persist?.onFinishHydration(() => {
      setIsStoreHydrated(true);
    });

    if (useAuthStore.persist?.hasHydrated()) {
      setIsStoreHydrated(true);
    }

    return () => unsub?.();
  }, []);

  const isAppReady = fontsReady && isStoreHydrated;

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady) return null;

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </ErrorBoundary>
  );
}