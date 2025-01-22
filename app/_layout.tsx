import { router, SplashScreen, Stack } from "expo-router";
import { EncodeSansSC_700Bold, useFonts } from "@expo-google-fonts/encode-sans-sc";
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import "../global.css";
import { useEffect } from "react";
import GlobalProvider, { useGlobalContext } from "@/context/GlobalProvider";
import 'react-native-get-random-values';

import * as Notifications from 'expo-notifications';
import { GoogleSignin } from "@react-native-google-signin/google-signin";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const { loading, user } = useGlobalContext();

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


  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;

      if (user && data.chatId) {
        router.push({
          pathname: '/chat/[chatId]',
          params: {
            chatId: data.chatId,
            otherUserId: data.senderId,
            otherUserName: data.senderName,
            otherUserPhotoUrl: data.senderImage
          }
        });
      }
    });

    return () => subscription.remove();
  }, [user]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboard" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(search)" options={{ headerShown: false }} />
      <Stack.Screen name="(edit-profile)" options={{ headerShown: false }} />
      <Stack.Screen name="chat/[chatId]" options={{ headerShown: false }} />
      <Stack.Screen name="chat/view-profile" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function App() {

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "578184461034-8knvop3k5d4hajhb6trocqmsgkaluohe.apps.googleusercontent.com"
    });
  }, [])

  return (
    <GlobalProvider>
      <RootLayout />
    </GlobalProvider>
  );
}