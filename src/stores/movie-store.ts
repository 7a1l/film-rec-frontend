import { create } from 'zustand';
import { moviesApi } from '../shared/api/movies-api';
import type { Genre, Movie, MovieDetails } from '../shared/api/types';
import { getApiErrorMessage } from '../lib/utils';

type MoviesState = {
    movies: Movie[];
    genres: Genre[];
    selectedMovie: MovieDetails | null;

    selectedGenreIds: number[];
    sortBy: string;
    currentPage: number;
    totalPages: number;
    pageSize: number;

    isLoading: boolean;
    isGenresLoading: boolean;
    isDetailsLoading: boolean;
    error: string | null;

    fetchGenres: () => Promise<void>;
    fetchMovies: () => Promise<void>;
    fetchRecommendations: () => Promise<void>;
    openMovieDetails: (id: number) => Promise<void>;
    closeMovieDetails: () => void;

    toggleGenre: (id: number) => void;
    resetGenres: () => void;
    setSortBy: (sort: string) => void;
    setPage: (page: number) => void;

    rateMovie: (id: number, action: 'like' | 'pass') => Promise<void>;
};

export const useMoviesStore = create<MoviesState>((set, get) => ({
    movies: [],
    genres: [],
    selectedMovie: null,

    selectedGenreIds: [],
    sortBy: 'For you',
    currentPage: 1,
    totalPages: 1,
    pageSize: 12,

    isLoading: false,
    isGenresLoading: false,
    isDetailsLoading: false,
    error: null,

    fetchGenres: async () => {
        if (get().genres.length > 0) return; 
        set({ isGenresLoading: true });
        try {
            const genres = await moviesApi.getGenres();
            set({ genres, isGenresLoading: false });
        } catch (error) {
            set({ 
                isGenresLoading: false, 
                error: getApiErrorMessage(error, 'Не удалось загрузить жанры') 
            });
        }
    },

    fetchMovies: async () => {
        const { currentPage, pageSize, selectedGenreIds, sortBy } = get();
        set({ isLoading: true, error: null });
        try {
            const response = await moviesApi.getMovies({
                page: currentPage,
                size: pageSize,
                genre_ids: selectedGenreIds,
                sort_by: sortBy,
            });
            set({
                movies: response.items,
                totalPages: response.pages,
                isLoading: false,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: getApiErrorMessage(error, 'Не удалось загрузить список фильмов'),
            });
        }
    },

    fetchRecommendations: async () => {
        const { currentPage, pageSize } = get();
        set({ isLoading: true, error: null });
        try {
            const response = await moviesApi.getRecommendations(currentPage, pageSize);
            set({
                movies: response.items,
                totalPages: response.pages,
                isLoading: false,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: getApiErrorMessage(error, 'Не удалось загрузить рекомендации'),
            });
        }
    },

    openMovieDetails: async (id) => {
        const basicMovie = get().movies.find((m) => m.id === id) || null;
        set({ selectedMovie: basicMovie, isDetailsLoading: true });

        try {
            const fullDetails = await moviesApi.getMovieById(id);
            set({ selectedMovie: fullDetails, isDetailsLoading: false });
        } catch (error) {
            set({ isDetailsLoading: false });
        }
    },

    closeMovieDetails: () => {
        set({ selectedMovie: null });
    },

    toggleGenre: (id) => {
        const { selectedGenreIds } = get();
        const exists = selectedGenreIds.includes(id);
        const updatedGenres = exists
            ? selectedGenreIds.filter((gId) => gId !== id)
            : [...selectedGenreIds, id];

        set({ selectedGenreIds: updatedGenres, currentPage: 1 });
        get().fetchMovies();
    },

    resetGenres: () => {
        set({ selectedGenreIds: [], currentPage: 1 });
        get().fetchMovies();
    },

    setSortBy: (sort) => {
        set({ sortBy: sort, currentPage: 1 });
        get().fetchMovies();
    },

    setPage: (page) => {
        set({ currentPage: page });
        get().fetchMovies();
    },

    rateMovie: async (id, action) => {
        try {
            await moviesApi.rateMovie(id, action);
            if (action === 'pass') {
                set((state) => ({
                    movies: state.movies.filter((m) => m.id !== id),
                }));
            }
        } catch (error) {
            console.error('Ошибка при оценке фильма:', error);
        }
    },
}));
