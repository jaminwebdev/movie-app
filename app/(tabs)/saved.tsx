import { ActivityIndicator, Text, FlatList , ScrollView} from 'react-native'
import React, { useCallback } from 'react'
import { useUser } from '../../context/UserContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from "@tanstack/react-query";
import { getSavedMovies } from '@/services/supabase';
import MovieCard from '@/components/MovieCard';
import { useFocusEffect } from 'expo-router';

const Saved = () => {

  const { userId } = useUser()
  
  const {
    data: movies = [],
    isLoading: moviesLoading,
    isError: moviesHasError,
    error: moviesError,
    refetch: refetchSaved
  } = useQuery({
    queryKey: ['saved'],
    queryFn: () => getSavedMovies(userId!),
    enabled: !!userId
  });

  useFocusEffect(
    useCallback(() => {
      refetchSaved();
    }, [refetchSaved])
  );

  if (moviesLoading) {
    return <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />;
  }

  if (moviesHasError && moviesError instanceof Error) {
    return <Text className="text-red-500">Error: {(moviesError as Error)?.message}</Text>;
  }

  if (!movies.length) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <Text className='text-slate-500'>Save movies to see them listed here</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}>
        <Text className="text-lg text-white font-bold m-5">Saved Movies</Text>

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
      </ScrollView>
    </SafeAreaView>
  )
}

export default Saved