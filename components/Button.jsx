import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../constants";

const Button = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  color,
  type,
  children,
}) => {
  const gradientStyles = {
    primary: [colors.primary[10], colors.primary[20]],
    secondary: [colors.secondary[10], colors.secondary[20]],
    tertiary: [colors.tertiary[10], colors.tertiary[20]],
    error: [colors.error[10], colors.error[20]],
    white: [colors.white, colors.white],
  };
  const borderStyles = {
    primary: "border-primary-10",
    secondary: "border-secondary-10",
    tertiary: "border-tertiary-10",
    error: "border-error-10",
  };
  const textColors = {
    primary: "text-primary-10",
    secondary: "text-secondary-10",
    tertiary: "text-tertiary-10",
    error: "text-error-10",
    white: "text-white",
    black: "text-black",
  };
  const text = type === "outline" ? textColors[color] : textColors.white;
  return (
    <LinearGradient
      className={`rounded-3xl ${containerStyles}`}
      colors={
        type === "outline"
          ? ["transparent", "transparent"]
          : gradientStyles[color]
      }
      locations={[0, 0.6]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className={`rounded-3xl ${
          type === "outline" ? "border-2 " + borderStyles[color] : ""
        } min-h-[56px] flex flex-row justify-center items-center ${
          isLoading ? "opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        {title ? (
          <Text
            className={`font-archivoBold text-lg m-3 ${text} ${textStyles} `}
          >
            {title}
          </Text>
        ) : (
          { children }
        )}
        {isLoading && (
          <ActivityIndicator
            animating={isLoading}
            color={colors.white}
            size="small"
            className="ml-2"
          />
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Button;
