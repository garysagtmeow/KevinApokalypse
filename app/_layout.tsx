import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { WebInstallBanner } from '@/src/components/WebInstallBanner';
import { RotateToLandscapeHint } from '@/src/components/RotateToLandscapeHint';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={DefaultTheme}>
        <View style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="game" options={{ headerShown: false }} />
            <Stack.Screen name="level2" options={{ headerShown: false }} />
            <Stack.Screen name="level3" options={{ headerShown: false }} />
            <Stack.Screen name="bonus" options={{ headerShown: false }} />
          </Stack>
          <WebInstallBanner />
          <RotateToLandscapeHint />
        </View>
        <StatusBar hidden />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
