import { TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";

const GoogleAuth = (styles) => {
  return (
    <TouchableOpacity>
      <Image
        source={icons.Google}
        className={`w-10 h-10 ${styles}`}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default GoogleAuth;
