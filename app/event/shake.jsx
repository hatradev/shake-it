import React, { useEffect, useState, useCallback } from "react";
import { Text, View, Image, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Header, AnimatedIcon, Button, Background } from "../../components";
import { icons, colors, images } from "../../constants";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import { Accelerometer } from "expo-sensors";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useGlobalContext } from "../../context";
import { idString } from "../../utils";

//GRAPHQL QUERY
const GET_REWARDS_BY_SESSION_ID = gql`
  query GetRewardsBySessionId($sessionId: String!) {
    getRewardsBySessionId(sessionId: $sessionId) {
      description
      id
      imageURL
      name
      type
      value
    }
  }
`;

const CREATE_PACKAGE = gql`
  mutation CreatePackage($userId: String!) {
    createPackage(allowExchange: true, userId: $userId)
  }
`;

const GET_PACKAGE = gql`
  query GetPackageByUserId($userId: String!) {
    getPackageByUserId(userId: $userId) {
      allow_exchange
      id
      rewards
      userId
      vouchers
    }
  }
`;

const ADD_REWARD_TO_PACKAGE = gql`
  mutation AddRewardToPackageById($packageID: ID!, $rewardID: ID!) {
    addRewardToPackageById(packageID: $packageID, rewardID: $rewardID)
  }
`;

const ShakeScreen = () => {
  const { id, name, brandId } = useLocalSearchParams();
  const { user } = useGlobalContext();
  const { loading, error, data } = useQuery(GET_REWARDS_BY_SESSION_ID, {
    variables: { sessionId: id },
  });
  const {
    loading: loadingPackage,
    error: errorPackage,
    data: packageData,
  } = useQuery(GET_PACKAGE, {
    variables: { userId: user },
  });
  const rewards = data?.getRewardsBySessionId || [];
  const [isModalVisible, setModalVisible] = useState(false);
  const [reward, setReward] = useState(null);
  const [addingReward, setAddingReward] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const [
    createPackageMutation,
    { loading: newLoadingPackage, error: newErrorPackage, data: newPackage },
  ] = useMutation(CREATE_PACKAGE);
  const [
    addRewardToPackageMutation,
    { loading: addLoading, error: addError, data: addData },
  ] = useMutation(ADD_REWARD_TO_PACKAGE);

  const comeBack = () => {
    router.back();
  };

  const addRewardToInventory = useCallback(
    async (reward) => {
      if (!user || !reward) return;

      setAddingReward(true);
      if (errorPackage) {
        console.log("Error when getting package", errorPackage);
        createPackageMutation({
          variables: { userId: user },
        });
        if (newErrorPackage) {
          console.log("Error when creating package", newErrorPackage);
          setAddingReward(false);
          return;
        }

        console.log("Package created", newPackage);
        addRewardToPackageMutation({
          variables: {
            packageID: idString(newPackage.id),
            rewardID: idString(reward.id),
          },
        });

        if (addError) {
          console.log("Error when adding reward to new package", addError);
        } else {
          console.log("Reward added to new package", addData);
          setAddSuccess(true);
        }
      } else if (packageData) {
        console.log(
          "Have a package data:",
          idString(packageData.getPackageByUserId.id),
          idString(reward.id)
        );
        addRewardToPackageMutation({
          variables: {
            packageID: idString(packageData.getPackageByUserId.id),
            rewardID: idString(reward.id),
          },
        });
        if (addError) {
          console.log("Error when adding reward to existing package", addError);
        } else {
          console.log("Reward added to existing package", addData);
          setAddSuccess(true);
        }
      }
      setAddingReward(false);
    },
    [user]
  );

  const handleShake = useCallback(() => {
    if (rewards.length > 0) {
      const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
      console.log("Result: ", randomReward.id);
      setReward(randomReward);
      setModalVisible(true);
      addRewardToInventory(randomReward);
    }
  }, [rewards, addRewardToInventory]);

  useEffect(() => {
    const threshold = 3;
    if (!isModalVisible && rewards.length > 0) {
      const subscription = Accelerometer.addListener((accelerometerData) => {
        const { x, y, z } = accelerometerData;
        const totalAcceleration = Math.sqrt(x * x + y * y + z * z);
        if (totalAcceleration > threshold) {
          handleShake();
        }
      });

      Accelerometer.setUpdateInterval(500);

      return () => {
        subscription.remove();
      };
    }
  }, [isModalVisible, reward, handleShake]);

  return (
    <>
      <SafeAreaView className="bg-primary-95 h-full flex">
        <Background type="space">
          <Header
            leftButton={icons.OutlineArrowBack}
            handleLeftButton={comeBack}
            rightButton={icons.SolidInventory}
            handleRightButton={() => router.push("/inventory")}
            title={name}
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
              title="Exchange"
              containerStyles="rounded-l-none rouned-r-3xl w-36"
              handlePress={() =>
                router.push({
                  pathname: "/event/exchange",
                  params: { id, brandId },
                })
              }
            />
            <Button
              color="primary"
              title="Daily task"
              containerStyles="rounded-r-none rouned-l-3xl w-36"
              // handlePress={() => router.push("/daily-task")}
            />
          </View>
        </Background>
      </SafeAreaView>
      <StatusBar backgroundColor={colors.transparent} style="dark" />
      {/* Modal hiển thị quà */}
      <Modal isVisible={isModalVisible}>
        <View className="bg-white flex items-center py-5 rounded-2xl">
          {addingReward ? (
            <ActivityIndicator
              size="large"
              color={colors.primary[70]}
              className="my-8"
            />
          ) : addSuccess ? (
            <>
              <Text className="font-archivoBold text-2xl mb-5">
                Congratulations!
              </Text>
              <Image
                source={
                  reward?.imageURL ? { uri: reward.imageURL } : images.icon
                }
                className="w-40 h-40"
                resizeMode="contain"
              />
              <Text className="font-archivoSemiBold text-xl my-3">{`Reward: ${reward?.name}`}</Text>
            </>
          ) : (
            <Text className="text-error-50 mb-3">
              Failed to add reward. Please try again.
            </Text>
          )}
          <Button
            color="primary"
            title="Close"
            handlePress={() => {
              setModalVisible(false);
              setReward(null);
              setAddSuccess(false);
            }}
          />
        </View>
      </Modal>
    </>
  );
};

export default ShakeScreen;
