import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Loader } from "../../components";
import { useGlobalContext } from "../../context";
import { colors } from "../../constants";

const AuthLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="loginWithOtp"
          options={{
            headerShown: false,
          }}
        />
        {/* <Stack.Screen
          name="register"
          options={{
            headerShown: false,
          }}
        /> */}
      </Stack>

      <Loader isLoading={loading} />
      <StatusBar backgroundColor={colors.primary[95]} style="dark" />
    </>
  );
};

export default AuthLayout;
