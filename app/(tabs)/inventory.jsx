import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useGlobalContext } from "../../context";
import { Loader, VoucherCard } from "../../components";
import { formattedDate } from "../../utils";
import React from "react";

const GET_INVENTORY = gql`
  query GetInventoryByUserId($userId: String!) {
    getRewardsByUserId(userId: $userId) {
      description
      id
      imageURL
      name
      type
      value
    }
    getVouchersByUserId(userId: $userId) {
      brandId
      code
      description
      expiredDate
      id
      imageURL
      value
    }
  }
`;

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("Rewards");
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const { loading, error, data, refetch } = useQuery(GET_INVENTORY, {
    variables: { userId: user },
    pollInterval: 2000,
    fetchPolicy: "network-only",
  });
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refetch]);
  const rewards = data?.getRewardsByUserId || [];
  const vouchers = data?.getVouchersByUserId || [];
  console.log("Inventory: ", rewards.length, vouchers.length);
  return (
    <>
      <SafeAreaView className="h-full bg-primary-50">
        <View className="bg-primary-50 px-6 pt-6">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-2xl font-semibold text-neutral-90 font-archivoBold">
              Inventory
            </Text>
            <View className="flex flex-row items-center space-x-4">
              <TouchableOpacity
                className={`${
                  activeTab === "Rewards" ? "border-b-2 border-primary-100" : ""
                }`}
                onPress={() => setActiveTab("Rewards")}
              >
                <Text
                  className={`${
                    activeTab === "Rewards"
                      ? "text-primary-100"
                      : "text-tertiary-70"
                  } text-base font-semibold font-archivoRegular`}
                >
                  Rewards
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`${
                  activeTab === "Vouchers"
                    ? "border-b-2 border-primary-100"
                    : ""
                }`}
                onPress={() => setActiveTab("Vouchers")}
              >
                <Text
                  className={`${
                    activeTab === "Vouchers"
                      ? "text-primary-100"
                      : "text-tertiary-70"
                  } text-base font-semibold font-archivoRegular`}
                >
                  Vouchers
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ScrollView
          className="bg-white mt-4 pt-6 rounded-t-3xl pb-6"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {activeTab === "Rewards" &&
            (rewards.length > 0 ? (
              rewards.map((reward, index) => (
                <VoucherCard
                  key={index}
                  id={reward.id}
                  title={reward.name}
                  image={reward.imageURL}
                  description={reward.description}
                />
              ))
            ) : (
              <Text className="text-center text-tertiary-70 font-archivoBold text-xl">
                No rewards found
              </Text>
            ))}

          {activeTab === "Vouchers" &&
            (vouchers.length > 0 ? (
              vouchers.map((voucher, index) => (
                <VoucherCard
                  key={index}
                  id={voucher.id}
                  title={`${voucher.description}: ${voucher.value}`}
                  image={voucher.imageURL}
                  description={`Expired date: ${formattedDate(
                    voucher.expiredDate
                  )}`}
                />
              ))
            ) : (
              <Text className="text-center text-tertiary-70 font-archivoBold text-xl">
                No vouchers found
              </Text>
            ))}
        </ScrollView>
        <View className="h-[60px] bg-white"></View>
      </SafeAreaView>
      <Loader loading={loading} />
    </>
  );
};

export default Inventory;
