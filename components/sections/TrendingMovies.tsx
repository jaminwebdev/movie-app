import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React, { useCallback } from 'react'
import TrendingCard from '../TrendingCard'
import { useQuery } from "@tanstack/react-query";
import { getTrendingMovies } from "@/services/supabase";
import { useFocusEffect } from 'expo-router';

const TrendingMovies = () => {

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
    useCallback(() => {
      refetchTrending();
    }, [refetchTrending])
  );

  if (trendingLoading) {
    return <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />;
  }

  if (trendingHasError && trendingError instanceof Error) {
    return <Text className="text-red-500">Error: {(trendingError as Error)?.message}</Text>;
  }

  if (!trendingMovies.length) {
    return ''
  }

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
          gap: 32,
        }}
        renderItem={({ item, index }) => (
          <TrendingCard movie={item} index={index} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

export default TrendingMovies