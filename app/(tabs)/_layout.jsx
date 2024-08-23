import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Image, Text, View } from "react-native";

import { icons, colors } from "../../constants";
import { Loader } from "../../components";
import { useState } from "react";

function TabIcon(props) {
  const { color, focused, outlineIcon, solidIcon } = props;
  return (
    <View className="flex items-center">
      <Image
        source={focused ? solidIcon : outlineIcon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
    </View>
  );
}

const TabLayout = () => {
  const [isLogged, setIsLogged] = useState(true);
  const [loading, setLoading] = useState(false);
  if (!loading && !isLogged) return <Redirect href="/" />;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary[10],
          tabBarInactiveTintColor: colors.neutral[60],
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: colors.white,
            borderTopWidth: 0,
            height: 60,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                solidIcon={icons.SolidHome}
                outlineIcon={icons.OutlineHome}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            title: "Discover",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                solidIcon={icons.SolidSearch}
                outlineIcon={icons.OutlineSearch}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="inventory"
          options={{
            title: "Inventory",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                solidIcon={icons.SolidInventory}
                outlineIcon={icons.OutlineInventory}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                solidIcon={icons.SolidUser}
                outlineIcon={icons.OutlineUser}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>

      <Loader isLoading={loading} />
      <StatusBar backgroundColor={colors.transparent} style="light" />
    </>
  );
};

export default TabLayout;
