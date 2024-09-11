import { Image, View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { images } from "../constants";
import { formattedDate, idString } from "../utils";

const VoucherCard = ({ id, image, title, description, handlePress }) => {
  return (
    <View className="px-6 mt-2">
      <TouchableOpacity
        onPress={handlePress}
        className="bg-primary-95 border-2 border-neutral-90 px-1 py-2 rounded-3xl flex flex-row items-center"
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
          <Text className="font-archivoRegular text-sm">{description}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default VoucherCard;
