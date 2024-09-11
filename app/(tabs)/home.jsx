import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { Button, GameCard } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { images, icons, colors } from "../../constants";
import { PieChart } from "react-native-gifted-charts";
import { Loader } from "../../components";

import { gql, useQuery } from "@apollo/client";

//GRAPHQL QUERY
const GET_ALL_GAME_SESSION = gql`
  query GetAllGameSession($id: String!) {
    getAllGameSession {
      brandId
      endTime
      id
      name
      startTime
      status
      imageURL
      rewards
    }
    getUserById(id: $id) {
      gender
      id
      imageURL
      name
    }
  }
`;

import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { useGlobalContext } from "../../context";

const Home = () => {
  //TEMP DATA

  const { user } = useGlobalContext();
  const DailyTask = {
    name: "Check in now",
    startAt: new Date().setHours(0, 0, 0, 0),
    endAt: new Date().setHours(23, 59, 59, 999),
  };
  const time = new Date();
  const pieData = [
    { value: time - DailyTask.startAt, color: colors.tertiary[40] },
    {
      value: DailyTask.endAt - time > 0 ? DailyTask.endAt - time : 0,
      color: colors.tertiary[70],
    },
  ];

  //GRAPHQL
  const { loading, error, data } = useQuery(GET_ALL_GAME_SESSION, {
    variables: { id: user },
  });
  const profile = data?.getUserById;
  const filteredGames = !error
    ? data?.getAllGameSession
        .filter((game) => game.status === true)
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
        .slice(0, 5)
    : [];

  //STATE
  const [greeting, setGreeting] = useState("");
  const [greetingIcon, setGreetingIcon] = useState(icons.OutlineSunny);

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting("GOOD MORNING");
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting("GOOD AFTERNOON");
    } else {
      setGreeting("GOOD EVENING");
      setGreetingIcon(icons.OutlineMoon);
    }
  }, []);

  //HANDLERS
  const viewAllEvents = () => {
    router.push({ pathname: "/discover" });
  };

  return (
    <>
      <SafeAreaView className="h-full bg-primary-50 ">
        <FlatList
          data={filteredGames}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GameCard
              gameId={item.id}
              title={item.name}
              image={item.imageURL}
              startTime={item.startTime}
              endTime={item.endTime}
              brandId={item.brandId}
            />
          )}
          ListHeaderComponent={() => (
            <View>
              <View className="bg-primary-50 px-6 py-6">
                <View className="flex flex-row items-center justify-between">
                  <View>
                    <View className="flex flex-row items-center justify-center">
                      <Image
                        source={greetingIcon}
                        className="w-5 h-5 mr-2"
                        tintColor={colors.tertiary[80]}
                        resizeMode="contain"
                      />
                      <Text className="text-sm font-archivoBold text-tertiary-80">
                        {greeting}
                      </Text>
                    </View>
                    <Text className="text-3xl font-archivoExtraBold text-white mt-4">
                      {profile?.name}
                    </Text>
                  </View>
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
                </View>
                <TouchableOpacity>
                  <View className="flex flex-row items-center justify-between bg-tertiary-80 rounded-3xl mt-6 p-6">
                    <View>
                      <Text className="text-base tracking-widest font-archivoBold text-tertiary-40">
                        DAILY TASK
                      </Text>
                      <View className="flex flex-row items-center mt-2">
                        <Image
                          source={icons.SolidGame}
                          className="w-6 h-6 mr-2"
                          tintColor={colors.tertiary[10]}
                          resizeMode="contain"
                        />
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          className="w-40 text-2xl font-archivoBold leading-6 text-tertiary-10"
                        >
                          {DailyTask.name}
                        </Text>
                      </View>
                    </View>
                    <PieChart radius={25} data={pieData} />
                  </View>
                </TouchableOpacity>

                <View className="relative flex items-center justify-center bg-primary-70 rounded-3xl mt-6 p-6">
                  <Text className="text-base tracking-widest font-archivoBold text-primary-90">
                    FEATURED
                  </Text>
                  <Text className="mt-4 text-xl text-center font-archivoSemiBold text-primary-90">
                    Take part in games with friends and give your vouchers
                  </Text>
                  <Button
                    color="white"
                    title="Send Vouchers"
                    containerStyles="rounded-3xl mt-4 w-36"
                    textStyles="text-primary-20 text-base"
                  />
                  <Image
                    source={images.FirstFriend}
                    className="w-12 h-12 absolute top-3 left-5"
                    resizeMode="contain"
                  />
                  <Image
                    source={images.SecondFriend}
                    className="w-12 h-12 absolute bottom-2 right-5"
                    resizeMode="contain"
                  />
                </View>
              </View>
              {/* Events list */}
              <View className="flex flex-row items-center justify-between bg-white rounded-t-3xl px-6 py-4">
                <Text className="text-primary-10 font-archivoBold text-xl">
                  Live events
                </Text>
                <TouchableOpacity onPress={viewAllEvents} activeOpacity={0.7}>
                  <Text className="text-primary-20 font-archivoRegular text-sm">
                    View all
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListFooterComponent={() => (
            <View className="h-[72px] bg-white"></View>
          )}
          ItemSeparatorComponent={() => <View className="h-6 bg-white"></View>}
        />
      </SafeAreaView>
      <Loader isLoading={loading} />
    </>
  );
};

export default Home;
