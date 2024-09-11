import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  Header,
  AnimatedIcon,
  Button,
  Background,
  Loader,
} from "../../../components";
import { icons, colors, images } from "../../../constants";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useGlobalContext } from "../../../context";
import { formattedDate, idString } from "../../../utils";

//GRAPHQL QUERY
const GET_ALL_EXCHANGE = gql`
  query GetAllExchangesBy(
    $sessionId: ID!
    $gameId: String!
    $brandId: String!
    $userId: String!
  ) {
    getAllExchangesBySessionID(sessionId: $sessionId) {
      createdAt
      gameSessionId
      id
      rewardIds
      voucherId
    }
    getRewardsBySessionId(sessionId: $gameId) {
      description
      id
      imageURL
      name
      type
      value
    }
    getAllVouchersByBrandId(brandId: $brandId) {
      brandId
      code
      description
      expiredDate
      id
      imageURL
      value
    }
    getPackageByUserId(userId: $userId) {
      allow_exchange
      id
      rewards
      userId
      vouchers
    }
  }
`;

const CREATE_EXCHANGE = gql`
  mutation CreateExchangeRequest(
    $voucherId: String!
    $userId: String!
    $rewardIds: [String]!
  ) {
    askForExchange(
      voucherId: $voucherId
      userId: $userId
      rewardIds: $rewardIds
    )
  }
`;

function createExchangeDataList(exchanges, rewards, vouchers, userPackage) {
  return exchanges.map((exchange) => {
    // Lấy thông tin rewards cho exchange hiện tại
    const exchangeRewards = exchange.rewardIds.map((rewardId) => {
      const reward = rewards.find((r) => idString(r.id) === rewardId);
      return {
        id: idString(reward.id),
        name: reward.name,
        imageURL: reward.imageURL,
        description: reward.description,
      };
    });

    // Lấy thông tin voucher cho exchange hiện tại
    const voucher = vouchers.find((v) => idString(v.id) === exchange.voucherId);
    const exchangeVoucher = voucher
      ? {
          id: idString(voucher.id),
          description: voucher.description,
          imageURL: voucher.imageURL,
          expiredDate: voucher.expiredDate,
          value: voucher.value,
        }
      : null;

    // Kiểm tra xem người dùng có thể quy đổi hay không
    const canExchange = exchange.rewardIds.every((rewardId) =>
      userPackage.rewards.includes(rewardId)
    );

    return {
      canExchange,
      id: exchange.id,
      rewards: exchangeRewards,
      voucher: exchangeVoucher,
      rewardIds: exchange.rewardIds,
    };
  });
}

const ExchangeScreen = () => {
  const { id, brandId } = useLocalSearchParams();
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_ALL_EXCHANGE, {
    variables: { sessionId: id, gameId: id, brandId, userId: user },
    pollInterval: 5000,
    fetchPolicy: "network-only",
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refetch]);
  const exchange = data?.getAllExchangesBySessionID || [];
  const rewards = data?.getRewardsBySessionId || [];
  const vouchers = data?.getAllVouchersByBrandId || [];
  const packageData = data?.getPackageByUserId || [];

  const exchangeDataList = createExchangeDataList(
    exchange,
    rewards,
    vouchers,
    packageData
  );

  const [
    createExchangeRequest,
    { data: reqData, loading: reqLoading, error: reqError },
  ] = useMutation(CREATE_EXCHANGE);

  const [isModalVisible, setModalVisible] = useState(false);
  const [exchangeData, setExchangeData] = useState(null);
  const [exchangeError, setExchangeError] = useState(false);
  const [exchangeSuccess, setExchangeSuccess] = useState(false);

  const confirmExchange = () => {
    setModalVisible(true);
    setExchangeSuccess(false);
    setExchangeError(false);
  };
  const handleExchange = (params) => {
    createExchangeRequest({
      variables: {
        voucherId: params.voucherId,
        userId: user,
        rewardIds: params.rewardIds,
      },
    });
  };
  const endExchange = () => {
    setModalVisible(false);
    setExchangeSuccess(false);
    setExchangeError(false);
    router.replace({
      pathname: "/event/exchange",
      params: { id, brandId },
    });
  };

  useEffect(() => {
    if (reqData) {
      setExchangeSuccess(true);
    }
    if (reqError) {
      setExchangeError(true);
    }
  }, [reqData, reqError]);

  return (
    <>
      <SafeAreaView className="bg-primary-20 h-full flex">
        <Header
          leftButton={icons.OutlineArrowBack}
          handleLeftButton={() => router.back()}
          rightButton={icons.SolidInventory}
          handleRightButton={() => router.push("/inventory")}
          title={"Exchange"}
          buttonColor={colors.primary[95]}
          titleStyle="text-primary-95"
        />
        <ScrollView
          className="bg-primary-99 rounded-t-2xl flex px-4 py-4"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {exchangeDataList &&
            exchangeDataList.map((exchangeData) => (
              <TouchableOpacity
                key={exchangeData.id}
                className="w-full flex flex-row items-center rounded-2xl bg-custom-0 px-2 py-2 mb-4"
                onPress={() => {
                  setExchangeData({
                    voucherName: exchangeData.voucher.description,
                    voucherId: exchangeData.voucher.id,
                    rewardIds: exchangeData.rewardIds,
                    gameSesssionId: id,
                  });
                  confirmExchange();
                }}
                disabled={!exchangeData.canExchange}
              >
                <View className="mr-4">
                  <Image
                    source={
                      exchangeData.voucher.imageURL
                        ? { uri: exchangeData.voucher.imageURL }
                        : images.icon
                    }
                    className="w-20 h-20 rounded-xl"
                    resizeMode="fill"
                  />
                </View>
                <View className="w-52">
                  <Text className="text-xl font-archivoBold text-neutral-10">{`${exchangeData.voucher.description}: ${exchangeData.voucher.value}`}</Text>
                  <Text className="text-sm font-archivoRegular text-neutral-10">{`Expired date: ${formattedDate(
                    exchangeData.voucher.expiredDate
                  )}`}</Text>
                  <Text className="text-sm font-archivoRegular text-neutral-10">
                    Required rewards:
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 16 }}
                    className="mt-2"
                  >
                    {exchangeData.rewards.map((reward, index) => (
                      <View key={index} className="flex flex-col items-center">
                        <Image
                          source={
                            reward.imageURL
                              ? { uri: reward.imageURL }
                              : images.icon
                          }
                          className="w-12 h-12 rounded-full"
                          resizeMode="fill"
                        />
                        <Text className="text-sm font-archivoRegular text-neutral-10">
                          {reward.name}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </SafeAreaView>
      <Modal isVisible={isModalVisible}>
        <View className="bg-white flex items-center py-5 rounded-2xl">
          {reqLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary[70]}
              className="my-8"
            />
          ) : exchangeSuccess ? (
            <>
              <Text className="font-archivoBold text-2xl mb-5">
                Congratulations!
              </Text>
              <Text className="font-archivoRegular text-lg mt-2 mx-4 text-center">
                {`You have successfully exchanged ${exchangeData?.voucherName} from ${exchangeData?.rewardIds.length} rewards.`}
              </Text>
              <Button
                title="Close"
                color="primary"
                containerStyles="rounded-3xl mt-5 w-36"
                handlePress={() => {
                  endExchange();
                }}
              />
            </>
          ) : exchangeError ? (
            <>
              <Text className="font-archivoBold text-2xl mb-5">Error!</Text>
              <Text className="font-archivoRegular text-lg mt-2">
                Failed to exchange. Please try again.
              </Text>
              <Button
                title="Close"
                color="primary"
                containerStyles="rounded-3xl mt-5 w-36"
                handlePress={() => {
                  setModalVisible(false);
                  setExchangeError(false);
                }}
              />
            </>
          ) : (
            <>
              <Text className="font-archivoBold text-2xl mb-5">
                Are you sure?
              </Text>
              <Text className="font-archivoRegular text-lg mt-2 text-center mx-4">
                You will exchange {exchangeData?.voucherName} from{" "}
                {exchangeData?.rewardIds.length} rewards.
              </Text>
              <View className="flex flex-row">
                <Button
                  title="Cancel"
                  color="primary"
                  type="outline"
                  containerStyles="rounded-3xl mt-5 w-28 mr-5"
                  handlePress={() => setModalVisible(false)}
                />
                <Button
                  title="Exchange"
                  color="primary"
                  containerStyles="rounded-3xl mt-5 w-28"
                  handlePress={() => handleExchange(exchangeData)}
                />
              </View>
            </>
          )}
        </View>
      </Modal>
      <StatusBar backgroundColor={colors.transparent} style="light" />
      <Loader isLoading={loading} />
    </>
  );
};

export default ExchangeScreen;
