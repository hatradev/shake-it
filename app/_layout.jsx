import { StyleSheet, Text, View } from "react-native";
import { Slot, SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "../data";
import GlobalProvider from "../context";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontLoaded, error] = useFonts({
    "Archivo-Regular": require("../assets/fonts/Archivo-Regular.ttf"),
    "Archivo-Black": require("../assets/fonts/Archivo-Black.ttf"),
    "Archivo-Bold": require("../assets/fonts/Archivo-Bold.ttf"),
    "Archivo-Medium": require("../assets/fonts/Archivo-Medium.ttf"),
    "Archivo-Light": require("../assets/fonts/Archivo-Light.ttf"),
    "Archivo-SemiBold": require("../assets/fonts/Archivo-SemiBold.ttf"),
    "Archivo-Thin": require("../assets/fonts/Archivo-Thin.ttf"),
    "Archivo-ExtraBold": require("../assets/fonts/Archivo-ExtraBold.ttf"),
    "Archivo-ExtraLight": require("../assets/fonts/Archivo-ExtraLight.ttf"),
    Digitalt: require("../assets/fonts/Digitalt.ttf"),
  });

  useEffect(() => {
    if (error) {
      throw error;
    }
    if (fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded, error]);

  if (!fontLoaded && !error) return null;
  return (
    <ApolloProvider client={client}>
      <GlobalProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          {/* <Stack.Screen name="(auth)" /> */}
          <Stack.Screen name="index" />
        </Stack>
      </GlobalProvider>
    </ApolloProvider>
  );
};

export default RootLayout;
