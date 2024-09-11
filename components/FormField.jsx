import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import { colors, icons } from "../constants";

const FormField = ({
  title,
  titleStyles,
  value,
  placeholder,
  placeholderTextColor,
  handleChangeText,
  otherStyles,
  inputStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text
        className={`text-base text-gray-100 font-archivoRegular ${titleStyles}`}
      >
        {title}
      </Text>
      <View className="w-full h-16 px-4 rounded-2xl border-2 border-neutral-20 focus:border-neutral-60 flex flex-row items-center">
        <TextInput
          className={`flex-1 text-black font-archivoRegular text-base ${inputStyles}`}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor || colors.neutral[80]}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.SolidEye : icons.SolidEyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
