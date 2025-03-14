import React from "react";
import { View, Image, ScrollView, ActivityIndicator, Text, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useFocusEffect } from "expo-router";

import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { getMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/supabase";

import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies = [],
    isLoading: trendingLoading,
    isError: trendingHasError,
    error: trendingError,
    refetch: refetchTrending
  } = useQuery({
    queryKey: ['trending'],
    queryFn: getTrendingMovies,
    staleTime: 0, // Consider data stale immediately
  });

  useFocusEffect(
    React.useCallback(() => {
      refetchTrending();
    }, [refetchTrending])
  );

  const {
    data: movies = [],
    isLoading: moviesLoading,
    isError: moviesHasError,
    error: moviesError
  } = useQuery({
    queryKey: ['latest'],
    queryFn: () => getMovies({ query: '' }),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const renderTrendingMovies = () => {
    return (
      <View className="mt-10">
        <Text className="text-lg text-white font-bold mb-3">
          Trending Movies
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4 mt-3"
          data={trendingMovies}
          contentContainerStyle={{
            gap: 26,
          }}
          renderItem={({ item, index }) => (
            <TrendingCard movie={item} index={index} />
          )}
          keyExtractor={(item) => item.movie_id.toString()}
          ItemSeparatorComponent={() => <View className="w-4" />}
        />
      </View>
    );
  };

  const maybeRenderMovies = () => {
    if (moviesLoading || trendingLoading) {
      return <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />;
    }

    if ((moviesHasError && moviesError instanceof Error) || (trendingHasError && trendingError instanceof Error)) {
      return <Text className="text-red-500">Error: {(moviesError as Error)?.message || (trendingError as Error)?.message}</Text>;
    }

    return (
      <View className="flex-1 mt-5">
        <SearchBar
          onPress={() => {
            router.push("/search");
          }}
          placeholder="Search for a movie"
        />

        {trendingMovies?.length > 0 ? renderTrendingMovies() : ''}

        <>
          <Text className="text-lg text-white font-bold m-5">Latest Movies</Text>

          <FlatList
            data={movies}
            renderItem={({ item }) => <MovieCard {...item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 20,
              marginBottom: 15,
            }}
            className="mt-2 pb-32"
            scrollEnabled={false}
          />
        </>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}>
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        {maybeRenderMovies()}
      </ScrollView>
    </View>
  );
}
