import { http } from "./http";
import type { 
    Genre, 
    MovieDetails, 
    MoviesFilterParams, 
    PaginatedMoviesResponse 
} from "./types";

export const moviesApi = {
    async getGenres(): Promise<Genre[]> {
        const { data } = await http.get<Genre[]>('/movies/genres');
        return data;
    },

    async getMovies(params: MoviesFilterParams): Promise<PaginatedMoviesResponse> {
        const { data } = await http.get<PaginatedMoviesResponse>('/movies', { 
            params: {
                page: params.page ?? 1,
                size: params.size ?? 12,
                sort_by: params.sort_by,
                genres: params.genre_ids?.length ? params.genre_ids.join(',') : undefined,
            }
        });
        return data;
    },

    async getMovieById(id: number): Promise<MovieDetails> {
        const { data } = await http.get<MovieDetails>(`/movies/${id}`);
        return data;
    },

    async getRecommendations(page = 1, size = 12): Promise<PaginatedMoviesResponse> {
        const { data } = await http.get<PaginatedMoviesResponse>('/movies/recommendations', {
            params: { page, size }
        });
        return data;
    },
    async rateMovie(movieId: number, action: 'like' | 'pass'): Promise<void> {
        await http.post(`/movies/${movieId}/${action}`);
    }
};
