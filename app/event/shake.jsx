import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Header, AnimatedIcon, Button, Background } from "../../components";
import { icons, colors } from "../../constants";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { DeviceMotion } from "expo-sensors";
import Modal from "react-native-modal";

import { getEventFromId } from "../../data";

const ShakeScreen = () => {
  const { id } = useLocalSearchParams();
  const event = getEventFromId(id);
  const comeBack = () => {
    router.back();
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const [giftNumber, setGiftNumber] = useState(0);

  useEffect(() => {
    const subscription = DeviceMotion.addListener((motionData) => {
      const { acceleration } = motionData;
      const accelerationMagnitude = Math.sqrt(
        acceleration.x * acceleration.x +
          acceleration.y * acceleration.y +
          acceleration.z * acceleration.z
      );

      if (accelerationMagnitude > 1.5) {
        // Lắc đủ mạnh để tính là một "shake"
        setShakeCount((prevCount) => prevCount + 1);
      }
    });

    // Thiết lập tần suất cập nhật cho DeviceMotion
    DeviceMotion.setUpdateInterval(100); // cập nhật mỗi 100ms

    if (shakeCount >= 2) {
      console.log("Ok, shake it!");
      setGiftNumber(Math.floor(Math.random() * event.gifts.length()) + 1);
      setModalVisible(true);
      setShakeCount(0);
    }

    return () => {
      subscription.remove();
    };
  }, [shakeCount]);

  return (
    <>
      <SafeAreaView className="bg-primary-95 h-full flex">
        <Background type="space">
          <Header
            leftButton={icons.OutlineArrowBack}
            handleLeftButton={comeBack}
            rightButton={icons.SolidSetting}
            title={event.name}
            buttonColor={colors.primary[95]}
            titleStyle="text-primary-95"
          />
          <View className="grow flex flex-row items-center justify-center">
            <View className="flex items-center rounded-2xl py-5 bg-custom-0">
              <AnimatedIcon
                icon={icons.GiftShaking}
                style="w-80 h-80"
                loop={true}
                autoPlay={true}
                speed={1.5}
              />
              <Text className="font-archivoSemiBold text-xl text-primary-70">
                Shake your phone
              </Text>
            </View>
          </View>
          <View className="flex flex-row items-center justify-between mb-5">
            <Button
              color="primary"
              title="Your gift"
              handlePress={() => setModalVisible(true)}
              containerStyles="rounded-l-none rouned-r-3xl w-36"
            />
            <Button
              color="primary"
              title="Daily task"
              containerStyles="rounded-r-none rouned-l-3xl w-36"
            />
          </View>
        </Background>
      </SafeAreaView>
      <StatusBar backgroundColor={colors.transparent} style="dark" />
      {/* Modal hiển thị quà */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View className="bg-white flex items-center py-5 rounded-2xl">
          <Text className="font-archivoBold text-2xl mb-5">Congratulation</Text>
          <Image
            src={event.gifts[0].image}
            className="w-40 h-40"
            resizeMode="contain"
          />
          <Text className="font-archivoSemiBold text-xl my-3">
            {event.gifts[0].description}
          </Text>
          <Button
            color="primary"
            title="View inventory"
            onPress={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
};

export default ShakeScreen;
