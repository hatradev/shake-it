import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "react-native";
import { ScrollView } from "react-native";

import { icons, colors } from "../../../constants";
import { getEventFromId } from "../../../data";
import { Button } from "../../../components";

const EventDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const event = getEventFromId(id);
  const formattedDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  const joinEvent = () => {
    console.log("Join Event");
    router.push({ pathname: `/event/shake`, params: { id } });
  };
  const comeBack = () => {
    console.log("Back to Home");
    router.back();
  };
  return (
    <>
      <View className="bg-tertiary-95 h-full">
        <ScrollView>
          <Image
            src={event.image}
            className="w-screen h-52"
            resizeMode="fill"
          />
          <Text className="font-archivoExtraBold text-2xl mx-5 mt-3">
            {event.name}
          </Text>
          <Text className="font-archivoRegular text-lg mx-5 mt-2">
            <Text className="font-archivoSemiBold">Description:</Text>{" "}
            {event.description}
          </Text>
          <Text className="font-archivoRegular text-lg mx-5 mt-1">
            <Text className="font-archivoSemiBold">Date:</Text>{" "}
            {formattedDate(event.startTime)} - {formattedDate(event.endTime)}
          </Text>
          <Text className="font-archivoRegular text-lg mx-5 mt-1">
            <Text className="font-archivoSemiBold">Rule:</Text> {event.rules}
          </Text>
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
      <StatusBar backgroundColor={colors.transparent} style="light" />
    </>
  );
};

export default EventDetailScreen;
