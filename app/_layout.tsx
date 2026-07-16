import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="game" options={{ headerShown: false }} />
        <Stack.Screen name="level2" options={{ headerShown: false }} />
        <Stack.Screen name="level3" options={{ headerShown: false }} />
        <Stack.Screen name="bonus" options={{ headerShown: false }} />
      </Stack>
      <StatusBar hidden />
    </ThemeProvider>
  );
}
