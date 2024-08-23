import { Image, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, images } from "../constants";

function PrimaryBackground(props) {
  const { styles, children } = props;
  return (
    <LinearGradient
      colors={[
        colors.secondary[10],
        colors.secondary[20],
        colors.secondary[30],
      ]}
      locations={[0, 0.5, 0.8]}
      start={{ x: 0.4, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      className={styles}
    >
      <Image
        source={images.cloud}
        className="absolute z-0 w-1/3 top-10 left-0"
        resizeMode="contain"
      />
      <Image
        source={images.cloud}
        className="absolute z-0 w-1/3 top-30 right-10"
        resizeMode="contain"
      />
      {children}
    </LinearGradient>
  );
}

function WelcomeBackground(props) {
  const { styles, children } = props;
  return (
    <View className={`relative w-full h-full ${styles}`}>
      <Image
        source={images.splash}
        className="w-full h-full z-0 absolute inset-0"
        resizeMode="fill"
      />
      {children}
    </View>
  );
}

function SpaceBackground(props) {
  const { styles, children } = props;
  return (
    <View className={`relative w-full h-full ${styles}`}>
      <Image
        source={images.Space}
        className="w-full h-full z-0 absolute inset-0"
        resizeMode="fill"
      />
      {children}
    </View>
  );
}

function Background(props) {
  let { type, styles, children } = props;
  if (type === "primary") {
    return <PrimaryBackground styles={styles}>{children}</PrimaryBackground>;
  }
  if (type === "welcome") {
    return <WelcomeBackground styles={styles}>{children}</WelcomeBackground>;
  }
  if (type === "space") {
    return <SpaceBackground styles={styles}>{children}</SpaceBackground>;
  }
}

export default Background;
