import { http } from "./http";
import type { Genre, InteractionCreateRequest, Movie, MoviesFilterParams } from "./types";

export const moviesApi = {
    async getGenres(): Promise<Genre[]> {
        const { data } = await http.get<Genre[]>('/genres');
        return data;
    },

    async getMovies(params: MoviesFilterParams): Promise<Movie[]> {
        const { data } = await http.get<Movie[]>('/movies', {
            params: {
                search: params.search || undefined,
                genre: params.genre && params.genre.length > 0 ? params.genre : undefined,
                page: params.page ?? 1,
                limit: params.limit ?? 12,
            },
            paramsSerializer: {
                indexes: null // Превращает массив в формат ?genre=A&genre=B для FastAPI
            }
        });
        return data;
    },

    async getMovieById(externalMovieId: number): Promise<Movie> {
        const { data } = await http.get<Movie>(`/movies/${externalMovieId}`);
        return data;
    },

    async createInteraction(payload: InteractionCreateRequest): Promise<void> {
        await http.post('/interactions', payload);
    },

    async getLikedMovies(): Promise<Movie[]> {
        const { data } = await http.get<Movie[]>('/interactions/likes');
        return data;
    },

    async deleteInteraction(externalMovieId: number): Promise<void> {
        await http.delete(`/interactions/${externalMovieId}`);
    },

    async getRecommendations(limit = 12): Promise<Movie[]> {
        const { data } = await http.get<Movie[]>('/recommendations', {
            params: { limit }
        });
        return data;
    }
};
