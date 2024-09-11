import { ApolloClient, InMemoryCache } from "@apollo/client";
import { Cache } from "react-native-cache";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const client = new ApolloClient({
  uri: "http://192.168.42.35:8080/graphql",
  cache: new InMemoryCache(),
});

const cache = new Cache({
  namespace: "VOU",
  policy: {
    maxEntries: 50000,
    stdTTL: 0,
  },
  backend: ReactNativeAsyncStorage,
});

const setUserId = async (userId) => {
  try {
    await cache.set("userId", userId);
  } catch (error) {
    console.log(error);
  }
};

const getUserId = async () => {
  try {
    const userId = await cache.get("userId");
    return userId;
  } catch (error) {
    return "";
  }
};

const removeUserId = async () => {
  await cache.remove("userId");
};

export default client;
export { cache, setUserId, getUserId, removeUserId };
