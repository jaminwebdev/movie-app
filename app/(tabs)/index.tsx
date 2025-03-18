import React from "react";
import { View, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

import SearchBar from "@/components/SearchBar";
import TrendingMovies from "@/components/sections/TrendingMovies";
import LatestMovies from "@/components/sections/LatestMovies";

export default function Index() {
  const router = useRouter();

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
        <Image source={icons.logo} className="w-12 mt-20 mb-5 mx-auto" />
        <View className="flex-1 mt-5">
          <SearchBar
            onPress={() => {
              router.push("/search");
            }}
            placeholder="Search for a movie"
          />
          <TrendingMovies/>
          <LatestMovies />
        </View>
      </ScrollView>
    </View>
  );
}
