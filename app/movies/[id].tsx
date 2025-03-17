import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import { useQuery, useMutation, useQueryClient  } from "@tanstack/react-query";
import { getMovieDetails } from "@/services/api";
import { useUser } from "../../context/UserContext";
import { saveMovie, getMovieSavedStatus } from "@/services/supabase";
import { useState } from "react";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-slate-500 font-normal text-sm">{label}</Text>
    <Text className="text-slate-500 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const MovieDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { userId } = useUser();
  const queryClient = useQueryClient();

  const {
    data: movie,
    isLoading,
    isError: movieHasError,
    error: movieError
  } = useQuery({
    queryKey: ['latest', id],
    queryFn: () => getMovieDetails(id as string),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const {
    data: savedStatus,
    isLoading: isSavedStatusLoading,
    isError: savedStatusHasError,
    error: savedStatusError
  } = useQuery({
    queryKey: ['savedStatus', id],
    queryFn: () => getMovieSavedStatus(movie!, userId as string),
    enabled: !!movie,
  });

  const { mutate: saveMovieMutation, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      if (!movie || !userId) throw new Error('Missing movie or user data');
      return saveMovie(movie, userId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['savedStatus', id]})
    }
  });

  const handleSaveMovie = () => {
    if (!movie) return;
    console.log(movie.vote_average)
    saveMovieMutation();
  };

  if (isLoading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

          <TouchableOpacity 
            className="absolute bottom-5 right-5 rounded-full size-14 bg-ratingBox flex items-center justify-center"
            onPress={handleSaveMovie}>
            <Image
              source={savedStatus ? icons.saved : icons.save}
              className="w-6 h-7"
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-slate-500 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-slate-500 text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />

            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>

            <Text className="text-slate-500 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute top-16 right-0 mx-5 bg-searchBar rounded-lg py-2.5 px-2 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;