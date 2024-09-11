import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button, GameCard } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { images, icons, colors } from "../../constants";
import { PieChart } from "react-native-gifted-charts";
import { Loader } from "../../components";

import { gql, useQuery } from "@apollo/client";

//GRAPHQL QUERY
const GET_ALL_GAME_SESSION = gql`
  query GetProfile($id: String!) {
    getUserById(id: $id) {
      createdAt
      dateOfBirth
      email
      facebookAccount
      firebaseUID
      gender
      id
      imageURL
      name
      phoneNumber
      role
      status
      updatedAt
      username
    }
  }
`;

import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { useGlobalContext } from "../../context";
import { formattedDate } from "../../utils";
import { removeUserId } from "../../data";

const Profile = () => {
  const { user } = useGlobalContext();
  //GRAPHQL
  const { loading, error, data } = useQuery(GET_ALL_GAME_SESSION, {
    variables: { id: user },
  });
  const profile = data?.getUserById;

  return (
    <>
      <SafeAreaView className="h-full bg-primary-50 ">
        <View className="flex flex-col items-center justify-between my-4">
          <Image
            source={
              profile?.imageURL
                ? { uri: profile?.imageURL }
                : profile?.gender
                ? images.MenAvatar
                : images.WomenAvatar
            }
            className="w-20 h-20 rounded-full"
            resizeMode="fill"
          />
          <Text className="text-3xl mt-2 font-semibold text-neutral-95 font-archivoBold">
            {profile?.name}
          </Text>
        </View>

        <View className="flex flex-row grow justify-between bg-white rounded-t-3xl px-6 py-4">
          <ScrollView>
            <View className="flex flex-col">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-lg text-neutral-10 font-archivoBold">
                  Username
                </Text>
                <Text className="text-lg text-neutral-10 font-archivoRegular">
                  {profile?.username}
                </Text>
              </View>

              <View className="flex flex-row items-center justify-between">
                <Text className="text-lg text-neutral-10 font-archivoBold">
                  Email
                </Text>
                <Text className="text-lg text-neutral-10 font-archivoRegular">
                  {profile?.email}
                </Text>
              </View>
              <View className="flex flex-row items-center justify-between">
                <Text className="text-lg text-neutral-10 font-archivoBold">
                  Phone Number
                </Text>
                <Text className="text-lg text-neutral-10 font-archivoRegular">
                  {profile?.phoneNumber}
                </Text>
              </View>
              <View className="flex flex-row items-center justify-between">
                <Text className="text-lg text-neutral-10 font-archivoBold">
                  Date of Birth
                </Text>
                <Text className="text-lg text-neutral-10 font-archivoRegular">
                  {formattedDate(profile?.dateOfBirth.slice(0, 10))}
                </Text>
              </View>
            </View>
            <Button
              title="Log out"
              color="primary"
              handlePress={() => {
                removeUserId();
                router.push("/");
              }}
              containerStyles={`w-3/4 mt-5 mx-auto`}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
      <Loader isLoading={loading} />
    </>
  );
};

export default Profile;
