import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, router, Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "react-native";
import { ScrollView } from "react-native";

import { icons, colors, images } from "../../../constants";
import { Button, Loader, VoucherCard } from "../../../components";
import { formattedDate } from "../../../utils";
import { gql, useQuery } from "@apollo/client";

//GRAPHQL QUERY
const GET_GAME_DATA_BY_ID = gql`
  query BrandById($gameId: ID!, $sessionId: String!, $brandId: String!) {
    getGameSessionByID(id: $gameId) {
      brandId
      endTime
      id
      imageURL
      name
      rewards
      startTime
      status
    }
    getRewardsBySessionId(sessionId: $sessionId) {
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
    brandById(id: $brandId) {
      address
      creatorId
      id
      industry
      name
      status
    }
  }
`;

const EventDetailScreen = () => {
  const { id, brandId } = useLocalSearchParams();
  const { loading, error, data } = useQuery(GET_GAME_DATA_BY_ID, {
    variables: { gameId: id, sessionId: id, brandId },
  });
  const event = data?.getGameSessionByID;
  const rewards = data?.getRewardsBySessionId;
  const brand = data?.brandById;
  const vouchers = data?.getAllVouchersByBrandId;
  console.log("Game Detail:", id);
  // Handlers
  const joinEvent = () => {
    console.log("Join Event", id);
    router.push({
      pathname: `/event/shake`,
      params: { id, name: event?.name, brandId },
    });
  };
  const comeBack = () => {
    router.back();
  };
  return (
    <>
      <View className="bg-tertiary-95 h-full">
        <ScrollView>
          <Image
            source={event?.imageURL ? { uri: event?.imageURL } : images.icon}
            className="w-screen h-52"
            resizeMode="fill"
          />
          <Text className="font-archivoExtraBold text-2xl mx-5 mt-3">
            {event?.name}
          </Text>
          <Text className="font-archivoRegular text-lg mx-5 mt-1">
            <Text className="font-archivoSemiBold">Date:</Text>{" "}
            {formattedDate(event?.startTime)} - {formattedDate(event?.endTime)}
          </Text>
          <Text className="font-archivoRegular text-lg mx-5 mt-2">
            <Text className="font-archivoSemiBold">Rewards:</Text>
          </Text>
          {rewards &&
            rewards.map((reward) => (
              <VoucherCard
                key={reward.id}
                id={reward.id}
                title={reward.name}
                description={reward.description}
                image={reward.imageURL}
              />
            ))}
          <View className="flex flex-row justify-between mx-5 mt-5">
            <Text className="font-archivoSemiBold text-lg ">{`Vouchers from ${brand?.name}`}</Text>
            <Link
              className="font-archivoSemiBold text-lg text-primary-50"
              href={{ pathname: `/event/exchange`, params: { id, brandId } }}
            >
              Exchange
            </Link>
          </View>
          {vouchers &&
            vouchers.map((voucher) => (
              <VoucherCard
                key={voucher.id}
                id={voucher.id}
                title={`${voucher.description}: ${voucher.value}`}
                image={voucher.imageURL}
                description={`Expired date: ${formattedDate(
                  voucher.expiredDate
                )}`}
              />
            ))}
        </ScrollView>
        <View className="flex flex-row justify-center mb-5">
          <Button
            title="Back to Home"
            type="outline"
            color="secondary"
            containerStyles="w-5/12 mt-5 mr-5"
            handlePress={comeBack}
          />
          <Button
            title="Join Event"
            color="tertiary"
            containerStyles="w-5/12 mt-5"
            handlePress={joinEvent}
          />
        </View>
      </View>
      <Loader isLoading={loading} />
      <StatusBar backgroundColor={colors.transparent} style="light" />
    </>
  );
};

export default EventDetailScreen;
