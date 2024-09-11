import { SearchInput } from "../../components";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button, GameCard } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { images, icons, colors } from "../../constants";
import { PieChart } from "react-native-gifted-charts";
import { Loader } from "../../components";
import { useEffect, useState } from "react";

import { gql, useQuery } from "@apollo/client";

//GRAPHQL QUERY
const GET_ALL_GAME_SESSION = gql`
  query GetAllGameSession {
    getAllGameSession {
      brandId
      endTime
      id
      name
      startTime
      status
      imageURL
      rewards
    }
  }
`;

const Discover = () => {
  const [gameList, setGameList] = useState([]);
  const [query, setQuery] = useState("");
  const { loading, error, data } = useQuery(GET_ALL_GAME_SESSION);
  useEffect(() => {
    if (data) {
      setGameList(data.getAllGameSession);
    }
  }, [data]);

  useEffect(() => {
    if (query) {
      const filteredList = data.getAllGameSession.filter((game) =>
        game.name.toLowerCase().includes(query.toLowerCase())
      );
      setGameList(filteredList);
    } else {
      setGameList(data.getAllGameSession);
    }
  }, [query, data]);
  return (
    <>
      <SafeAreaView className="h-full bg-primary-50">
        <View className="bg-primary-50 px-6 pt-6">
          <Text className="mx-auto mb-2 text-2xl font-semibold text-neutral-90 font-archivoBold">
            Discover
          </Text>
          <SearchInput query={query} onChangeText={(e) => setQuery(e)} />
        </View>

        <ScrollView className="bg-white mt-4 pt-6 rounded-t-3xl">
          {gameList.length > 0 &&
            gameList.map((game) => (
              <GameCard
                key={game.id}
                gameId={game.id}
                title={game.name}
                image={game.imageURL}
                startTime={game.startTime}
                endTime={game.endTime}
                brandId={game.brandId}
              />
            ))}
          {gameList.length <= 0 && (
            <View className="flex items-center">
              <Text className="font-archivoSemiBold text-xl">No results</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Discover;
