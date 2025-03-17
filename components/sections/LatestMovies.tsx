import { Text, FlatList, ActivityIndicator } from 'react-native'
import React from 'react'
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";


const LatestMovies = () => {

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

  if (moviesLoading) {
    return <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />;
  }

  if (moviesHasError && moviesError instanceof Error) {
    return <Text className="text-red-500">Error: {(moviesError as Error)?.message}</Text>;
  }

  return (
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
  )
}

export default LatestMovies