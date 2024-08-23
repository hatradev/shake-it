import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Button, GameCard } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { images, icons, colors } from "../../constants";
import { PieChart } from "react-native-gifted-charts";
import { events } from "../../data";

import React, { useState, useEffect } from "react";

const Home = () => {
  //TEMP DATA
  const Name = "John Doe";
  const RecentGame = {
    name: "Sicup - Shake To Win",
    startAt: new Date("2024-08-15T00:00:00Z"),
    endAt: new Date("2024-08-31T23:59:59Z"),
  };
  const time = new Date();
  const pieData = [
    { value: time - RecentGame.startAt, color: colors.tertiary[40] },
    { value: RecentGame.endAt - time, color: colors.tertiary[70] },
  ];

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
    console.log("View all events");
  };

  return (
    <SafeAreaView className="h-full bg-primary-50 ">
      <FlatList
        data={events.events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GameCard
            gameId={item.id}
            title={item.name}
            image={item.image}
            description={item.description}
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
                    {Name}
                  </Text>
                </View>
                <Image
                  source={images.WomenAvatar}
                  className="w-20 h-20"
                  resizeMode="contain"
                />
              </View>

              <View className="flex flex-row items-center justify-between bg-tertiary-80 rounded-3xl mt-6 p-6">
                <View>
                  <Text className="text-base tracking-widest font-archivoBold text-tertiary-40">
                    RECENT EVENT
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
                      {RecentGame.name}
                    </Text>
                  </View>
                </View>
                <PieChart radius={25} data={pieData} />
              </View>

              <View className="relative flex items-center justify-center bg-primary-70 rounded-3xl mt-6 p-6">
                <Text className="text-base tracking-widest font-archivoBold text-primary-90">
                  FEATURED
                </Text>
                <Text className="mt-4 text-xl text-center font-archivoSemiBold text-primary-90">
                  Take part in games with friends and exchange your gifts
                </Text>
                <Button
                  color="white"
                  title="Exchange"
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
        ListFooterComponent={() => <View className="h-[72px] bg-white"></View>}
        ItemSeparatorComponent={() => <View className="h-6 bg-white"></View>}
      />
    </SafeAreaView>
  );
};

export default Home;
