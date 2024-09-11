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
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../../data/auth";

const Login = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [form, setForm] = useState({
    phoneNumber: "",
    otp: "",
  });

  const submit = () => {
    router.replace("/home");
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

          {showOtp && (
            <FormField
              title="OTP Code"
              value={form.otp}
              handleChangeText={(e) => setForm({ ...form, otp: e })}
              otherStyles="mt-7"
              keyboardType="number-pad"
              titleStyles={"text-neutral-10"}
              inputStyles={"text-neutral-10"}
            />
          )}

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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
