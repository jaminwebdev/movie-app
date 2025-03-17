import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL!
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export const updateSearchMetrics = async (query: string, movie: Movie) => {
  try {
    const { data: existingMetric } = await supabase
      .from('movieApp_metrics')
      .select('*')
      .eq('searchTerm', query)
      .single()

    if (existingMetric) {
      const { error } = await supabase
        .from('movieApp_metrics')
        .update({ count: existingMetric.count + 1 })
        .eq('searchTerm', query)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('movieApp_metrics')
        .insert({
          searchTerm: query,
          movie_id: movie.id,
          title: movie.title,
          count: 1,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        })

      if (error) throw error
    }
  } catch (error) {
    console.error('Error updating search metrics:', error)
    throw error
  }
}

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {

    const { data: result, error } = await supabase
    .from('movieApp_metrics')
    .select()
    .order('count', { ascending: false })
    .limit(5)

    if (error) throw error

    return result as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const saveMovie = async (movie: MovieDetails, userId: string) => {
  try {
    const { data: savedMovie } = await supabase
      .from('movieApp_saved')
      .select('*')
      .eq('movie_id', movie.id)
      .eq('user_id', userId)
      .single()

    if (savedMovie) {
      const { error } = await supabase
        .from('movieApp_saved')
        .delete()
        .eq('movie_id', movie.id)
        .eq('user_id', userId)

      if (error) throw error

      return false
    } else {
      const { error } = await supabase
        .from('movieApp_saved')
        .insert({
          user_id: userId,
          movie_id: movie.id,
          title: movie.title,
          vote_average: movie.vote_average,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          release_date: movie.release_date
        })

      if (error) throw error

      return true
    }
  } catch (error) {
    console.error('Error updating saved movies:', error)
    throw error
  }
}

export const getMovieSavedStatus = async (movie: MovieDetails, userId: string) => {
  try {
    const { data: savedMovie, error } = await supabase
      .from('movieApp_saved')
      .select('*')
      .eq('movie_id', movie.id)
      .eq('user_id', userId)

    if (error && error.details !== 'The result contains 0 rows') throw error

    if (!savedMovie?.length) return false

    return true

  } catch (error) {
    console.error('Error updating saved movie status:', error)
    throw error
  }
}

export const getSavedMoves = async(userId: string) => {
  try {
    if (!userId) return

    const { data: savedMovies, error } = await supabase
      .from('movieApp_saved')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error

    return savedMovies
  } catch (error) {
    console.error('Error getting saved movies:', error)
    throw error
  }
}