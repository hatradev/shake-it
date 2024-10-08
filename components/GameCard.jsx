import { Image, View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { images } from "../constants";
import { formattedDate, idString } from "../utils";

const GameCard = ({ gameId, image, title, startTime, endTime, brandId }) => {
  const handlePress = () => {
    router.push({
      pathname: `/event/detail/${idString(gameId)}`,
      params: { brandId },
    });
  };
  return (
    <View className="bg-white px-6">
      <TouchableOpacity
        onPress={handlePress}
        className="border-2 border-neutral-90 px-1 py-2 rounded-3xl flex flex-row items-center"
        activeOpacity={0.7}
      >
        <Image
          source={image ? { uri: image } : images.icon}
          className="h-16 w-16 mr-4"
          resizeMode="contain"
          borderRadius={20}
        />
        <View className="flex">
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="font-archivoBold text-lg w-52"
          >
            {title}
          </Text>
          <Text className="font-archivoRegular text-sm">{`${formattedDate(
            startTime
          )} - ${formattedDate(endTime)}`}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default GameCard;
