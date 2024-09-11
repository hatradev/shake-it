import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";

import { Button, FormField, Header } from "../../components";
import { useGlobalContext } from "../../context";
import { getUserId } from "../../data";
import { logIn } from "../../data/auth";
import { icons } from "../../constants";

const Login = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    phoneNumber: "",
    password: "",
  });

  const submit = async () => {
    router.replace("/home");
    // if (form.phoneNumber === "" || form.password === "") {
    //   Alert.alert("Error", "Please fill in all fields");
    //   return;
    // }

    // setSubmitting(true);

    // try {
    //   await logIn();
    //   const result = await getUserId();
    //   setUser(result);
    //   setIsLogged(true);

    //   Alert.alert("Success", "User signed in successfully");
    //   router.replace("/home");
    // } catch (error) {
    //   Alert.alert("Error", error.message);
    // } finally {
    //   setSubmitting(false);
    // }
  };

  return (
    <SafeAreaView className="bg-tertiary-95 h-full">
      <Header
        leftButton={icons.OutlineArrowBack}
        handleLeftButton={() => {
          router.back();
        }}
      />
      <ScrollView>
        <View
          className="w-full flex h-full px-4"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Text className="text-2xl font-semibold text-neutral-10 mt-10 font-archivoBold">
            Log in to VOU
          </Text>

          <FormField
            title="Phone Number"
            value={form.phoneNumber}
            handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
            otherStyles="mt-7"
            keyboardType="number-pad"
            titleStyles={"text-neutral-10"}
            inputStyles={"text-neutral-10"}
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            titleStyles={"text-neutral-10"}
            inputStyles={"text-neutral-10"}
          />

          <View className="flex justify-end mt-2 flex-row">
            <Link
              href="/loginWithOtp"
              className="text-sm font-archivoSemiBold text-secondary-40"
            >
              Log in with OTP Code
            </Link>
          </View>
          <Button
            color="primary"
            title="Log In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-neutral-10 font-archivoRegular">
              Don't have an account?
            </Text>
            <Link
              href="/register"
              className="text-lg font-archivoSemiBold text-secondary-40"
            >
              Register
            </Link>
          </View>
          <View className="flex justify-center pt-5 flex-row">
            <Text className="text-base text-neutral-60 font-archivoRegular">
              Or
            </Text>
          </View>
          <View className="flex justify-center pt-5 flex-row gap-4">
            <TouchableOpacity>
              <Image
                source={icons.Facebook}
                className="w-10 h-10"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={icons.Google}
                className="w-10 h-10"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
