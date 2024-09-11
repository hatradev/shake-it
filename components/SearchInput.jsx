import { useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Image, TextInput, Alert } from "react-native";

import { colors, icons } from "../constants";

const SearchInput = ({ query, onChangeText }) => {
  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 rounded-2xl border-2 border-white">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-archivoRegular"
        value={query}
        placeholder="Search a session game"
        placeholderTextColor={colors.primary[95]}
        onChangeText={onChangeText}
      />

      <TouchableOpacity>
        <Image
          source={icons.OutlineSearch}
          className="w-6 h-6"
          resizeMode="contain"
          tintColor={colors.white}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
