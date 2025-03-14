import React from "react";
import { useState, useRef } from "react";
import { View, Text, ActivityIndicator, FlatList, Image } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

import { getMovies } from "@/services/api";
import { updateSearchMetrics } from "@/services/supabase";

import SearchBar from "@/components/SearchBar";
import MovieDisplayCard from "@/components/MovieCard";

const Search = () => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout>();

  const {
    data: movies = [],
    isLoading: loading,
    isError: hasError,
    error,
    isFetching
  } = useQuery({
    queryKey: ['movies', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];
      const results = await getMovies({ query: debouncedQuery });
      
      if (results?.length > 0) {
        await updateSearchMetrics(debouncedQuery, results[0]);
      }
      
      return results;
    },
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data for 10 minutes
    refetchOnWindowFocus: false,
  });

  const handleSearch = (text: string) => {
    setInputValue(text);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(text); 
    }, 700);
  };

  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const maybeRenderSearchTerm = () => {

    if (loading || isFetching) {
      return (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="my-3"/>
      )
    }
  
    if (hasError && error instanceof Error) {
      return (
        <Text className="text-red-500 px-5 my-3">
          Error: {error.message}
        </Text>
      )
    }
    
    if (debouncedQuery.trim() && movies?.length > 0) {
      return (
        <Text className="text-xl text-white font-bold">
          Search Results for{" "}
          <Text className="text-accent">{debouncedQuery}</Text>
        </Text>
      )
    }
      
  }

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        className="px-5"
        data={movies as Movie[]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieDisplayCard {...item} />}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search for a movie"
                value={inputValue}
                onChangeText={handleSearch}
              />
            </View>

            {maybeRenderSearchTerm()}
          </>
        }
        ListEmptyComponent={
          !loading && !hasError ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {debouncedQuery.trim()
                  ? "No movies found"
                  : "Start typing to search for movies"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;