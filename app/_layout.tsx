import { SplashScreen, Stack } from "expo-router";
import { EncodeSansSC_700Bold, useFonts } from "@expo-google-fonts/encode-sans-sc";
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import "../global.css";
import { useEffect } from "react";
import GlobalProvider, { useGlobalContext } from "@/context/GlobalProvider";
import 'react-native-get-random-values';

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const { loading } = useGlobalContext();

  const [loadFonts, error] = useFonts({
    EncodeSansSC_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (loadFonts && !loading) {
      SplashScreen.hideAsync();
    }
  }, [loadFonts, loading]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboard" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(search)" options={{ headerShown: false }} />
      <Stack.Screen name="chat/[chatId]" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function App() {
  return (
    <GlobalProvider>
      <RootLayout />
    </GlobalProvider>
  );
}