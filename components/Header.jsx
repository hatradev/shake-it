import { Image, View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const Header = ({
  leftButton,
  handleLeftButton,
  title,
  rightButton,
  handleRightButton,
  buttonStyle,
  buttonColor,
  containerStyle,
  titleStyle,
}) => {
  return (
    <View
      className={`w-full px-2 py-2 flex flex-row items-center justify-between relative ${containerStyle}`}
    >
      {leftButton && (
        <TouchableOpacity
          onPress={handleLeftButton}
          className={`px-1 py-2 rounded-3xl flex flex-row items-center ${buttonStyle}`}
          activeOpacity={0.7}
        >
          <Image
            source={leftButton}
            className="h-6 w-6"
            resizeMode="contain"
            borderRadius={20}
            tintColor={buttonColor}
          />
        </TouchableOpacity>
      )}
      {title && (
        <View className="absolute w-screen flex items-center">
          <Text
            className={`w-60 text-center font-archivoBold text-lg ${titleStyle}`}
          >
            {title}
          </Text>
        </View>
      )}

      {rightButton && (
        <TouchableOpacity
          onPress={handleRightButton}
          className={`px-1 py-2 rounded-3xl flex flex-row items-center ${buttonStyle}`}
          activeOpacity={0.7}
        >
          <Image
            source={rightButton}
            className="h-6 w-6"
            resizeMode="contain"
            tintColor={buttonColor}
            borderRadius={20}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
