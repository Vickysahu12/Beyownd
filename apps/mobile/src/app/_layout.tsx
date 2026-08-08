import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts as useSora, Sora_600SemiBold, Sora_700Bold } from '@expo-google-fonts/sora';
import { useFonts as useInter, Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { colors } from '@/constants/theme';
import { HomeThemeProvider } from '@/context/ThemeContext';

// Production Utilities
import OfflineBanner from '@/components/common/OfflineBanner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [soraLoaded] = useSora({ Sora_600SemiBold, Sora_700Bold });
  const [interLoaded] = useInter({ Inter_400Regular, Inter_500Medium });

  const fontsReady = soraLoaded && interLoaded;

  useEffect(() => {
    if (fontsReady) SplashScreen.hideAsync();
  }, [fontsReady]);

  if (!fontsReady) return null;

  return (
    <ErrorBoundary>
      <HomeThemeProvider>
        <OfflineBanner />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
          }}
        />
      </HomeThemeProvider>
    </ErrorBoundary>
  );
}