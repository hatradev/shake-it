import React, { useEffect } from "react";
import { Text, View, Image } from "react-native";
import { Background, Button } from "../components";
import { router, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors, images } from "../constants";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useGlobalContext } from "../context";
import { setUserId } from "../data";

export default function App() {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  const translateY = useSharedValue(300);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 800,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <>
      <Background type="welcome">
        <View className="flex items-center justify-center h-full">
          <Image
            source={images.icon}
            className="flex-1 w-1/3 h-1/3"
            resizeMode="contain"
          />
          <Animated.View
            style={animatedStyle}
            className="flex items-center justify-center bg-primary-95 w-full rounded-t-5xl pt-12 pb-8"
          >
            <Text className="text-4xl font-digitalt">Welcome to VOU</Text>
            <View className="mt-5 w-11/12 flex items-center justify-center">
              <Button
                color="primary"
                title="Login"
                containerStyles="w-full"
                handlePress={() => {
                  setUserId("66d6868afed0174f007b7e1a");
                  router.push("/home");
                }}
              />
              <Button
                color="secondary"
                type="outline"
                title="Register"
                containerStyles="mt-2 w-full"
                // handlePress={() => router.push("/register")}
              />
            </View>
          </Animated.View>
          <StatusBar backgroundColor={colors.primary[95]} style="dark" />
        </View>
      </Background>
    </>
  );
}
