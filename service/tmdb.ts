//tmdb.ts utilisation de l'api tmdb pour récupérer les films et séries

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const getTrendingMovies = async () => {
    const response = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
};
