import React from "react";
import LottieView from "lottie-react-native";

const AnimatedIcon = ({ icon, style, autoPlay, loop, speed, resizeMode }) => {
  return (
    <LottieView
      source={icon}
      autoPlay={autoPlay}
      loop={loop}
      speed={speed}
      resizeMode={resizeMode}
      className={style}
    />
  );
};

export default AnimatedIcon;
