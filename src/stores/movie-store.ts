import { create } from 'zustand';
import { moviesApi } from '../shared/api/movies-api';
import type { Genre, Movie } from '../shared/api/types';
import { getApiErrorMessage } from '../lib/utils';

type MoviesState = {
    movies: Movie[];
    likedMovies: Movie[];
    genres: Genre[];
    selectedMovie: Movie | null;

    yearFrom: string;
    yearTo: string;
    selectedGenres: string[];
    searchQuery: string;
    sortBy: string;
    currentPage: number;
    hasMorePages: boolean;
    pageSize: number;

    isLoading: boolean;
    isGenresLoading: boolean;
    isDetailsLoading: boolean;
    error: string | null;

    fetchGenres: () => Promise<void>;
    fetchMovies: () => Promise<void>;
    fetchRecommendations: () => Promise<void>;
    fetchLikedMovies: () => Promise<void>;
    openMovieDetails: (externalId: number) => Promise<void>;
    closeMovieDetails: () => void;

    toggleGenre: (genreName: string) => void;
    setSelectedGenres: (genres: string[]) => void;
    setYearRange: (from: string, to: string) => void;
    resetGenres: () => void;
    setSearchQuery: (query: string) => void;
    setSortBy: (sort: string) => void;
    setPage: (page: number) => void;

    rateMovie: (movie: Movie, rating: 1 | -1) => Promise<void>;
    removeLikedMovie: (movie: Movie) => Promise<void>;
};

export const useMoviesStore = create<MoviesState>((set, get) => ({
    movies: [],
    likedMovies: [],
    genres: [],
    selectedMovie: null,

    selectedGenres: [],
    searchQuery: '',
    sortBy: 'For you',
    currentPage: 1,
    hasMorePages: true,
    pageSize: 12,
    yearFrom: '1990',
    yearTo: '2026',

    isLoading: false,
    isGenresLoading: false,
    isDetailsLoading: false,
    error: null,

    fetchGenres: async () => {
        if (get().genres.length > 0) return;
        set({ isGenresLoading: true });
        try {
            const genres = await moviesApi.getGenres();
            set({ genres: Array.isArray(genres) ? genres : [], isGenresLoading: false });
        } catch (error) {
            set({
                isGenresLoading: false,
                error: getApiErrorMessage(error, 'Не удалось загрузить жанры')
            });
        }
    },

    fetchMovies: async () => {
        const { currentPage, pageSize, selectedGenres, searchQuery, yearFrom, yearTo, sortBy } = get();
        set({ isLoading: true, error: null });
        try {
            const list = await moviesApi.getMovies({
                page: currentPage,
                limit: pageSize,
                genre: selectedGenres.length > 0 ? selectedGenres : undefined,
                search: searchQuery.trim() || undefined,
            });

            let safeList = Array.isArray(list) ? list : [];

            // Фильтрация по диапазону годов
            const minYear = Number(yearFrom);
            const maxYear = Number(yearTo);
            if (!Number.isNaN(minYear) && !Number.isNaN(maxYear)) {
                safeList = safeList.filter((movie) => {
                    if (!movie.year) return false;
                    return movie.year >= minYear && movie.year <= maxYear;
                });
            }

            // Локальная сортировка
            if (sortBy === 'rating') {
                safeList = [...safeList].sort((a, b) => (b.rating_kinopoisk ?? 0) - (a.rating_kinopoisk ?? 0));
            } else if (sortBy === 'year') {
                safeList = [...safeList].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
            }

            set({
                movies: safeList,
                hasMorePages: list.length === pageSize,
                isLoading: false,
            });
        } catch (error) {
            set({
                movies: [],
                isLoading: false,
                error: getApiErrorMessage(error, 'Не удалось загрузить фильмы'),
            });
        }
    },

    fetchRecommendations: async () => {
        set({ isLoading: true, error: null });
        try {
            const list = await moviesApi.getRecommendations(20);
            set({
                movies: Array.isArray(list) ? list : [],
                hasMorePages: false,
                isLoading: false,
            });
        } catch (error) {
            set({
                movies: [],
                isLoading: false,
                error: getApiErrorMessage(error, 'Не удалось загрузить рекомендации'),
            });
        }
    },

    fetchLikedMovies: async () => {
        try {
            const list = await moviesApi.getLikedMovies();
            set({ likedMovies: Array.isArray(list) ? list : [] });
        } catch (error) {
            console.error('Ошибка загрузки лайков:', error);
        }
    },

    openMovieDetails: async (externalId) => {
        const basicMovie =
            get().movies.find((m) => m.movie_external_id === externalId) ||
            get().likedMovies.find((m) => m.movie_external_id === externalId) ||
            null;

        set({ selectedMovie: basicMovie, isDetailsLoading: true });
        try {
            const details = await moviesApi.getMovieById(externalId);
            set({ selectedMovie: details, isDetailsLoading: false });
        } catch {
            set({ isDetailsLoading: false });
        }
    },

    closeMovieDetails: () => {
        set({ selectedMovie: null });
    },

    toggleGenre: (genreName) => {
        const current = get().selectedGenres;
        const nextGenres = current.includes(genreName)
            ? current.filter((g) => g !== genreName)
            : [...current, genreName];

        set({ selectedGenres: nextGenres, currentPage: 1 });
        get().fetchMovies();
    },

    setSelectedGenres: (genres) => {
        set({ selectedGenres: genres, currentPage: 1 });
        get().fetchMovies();
    },

    setYearRange: (from, to) => {
        set({ yearFrom: from, yearTo: to, currentPage: 1 });
        get().fetchMovies();
    },

    resetGenres: () => {
        set({ selectedGenres: [], searchQuery: '', yearFrom: '1990', yearTo: '2026', currentPage: 1 });
        get().fetchMovies();
    },

    setSearchQuery: (query) => {
        set({ searchQuery: query });
    },


    setSortBy: (sort) => {
        set({ sortBy: sort });
        get().fetchMovies();
    },

    setPage: (page) => {
        set({ currentPage: page });
        get().fetchMovies();
    },

    rateMovie: async (movie, rating) => {
        try {
            const targetId = movie.movie_external_id || movie.id;
            await moviesApi.createInteraction({ movie_id: targetId, rating });

            if (rating === 1) {
                set((state) => {
                    const exists = state.likedMovies.some((m) => m.id === movie.id);
                    return exists ? state : { likedMovies: [movie, ...state.likedMovies] };
                });
            } else if (rating === -1) {
                set((state) => ({
                    movies: state.movies.filter((m) => m.id !== movie.id),
                    likedMovies: state.likedMovies.filter((m) => m.id !== movie.id),
                }));
            }
        } catch (error) {
            console.error('Ошибка при отправке оценки:', error);
        }
    },

    removeLikedMovie: async (movie) => {
        set((state) => ({
            likedMovies: state.likedMovies.filter((m) => m.id !== movie.id),
        }));

        try {
            const targetId = movie.movie_external_id || movie.id;
            await moviesApi.deleteInteraction(targetId);
        } catch (error) {
            console.error('Ошибка при удалении лайка:', error);
            get().fetchLikedMovies();
        }
    },
}));
