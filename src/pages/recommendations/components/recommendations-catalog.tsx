import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, RefreshCw, Info, Film } from "lucide-react";
import { useMoviesStore } from "@/stores/movie-store";
import { MovieCard } from "@/pages/films/components/movie-card";
import { MovieDetailModal } from "@/pages/films/components/movie-detail-modal";

export function RecommendationsCatalog() {
  const movies = useMoviesStore((s) => s.movies) ?? [];
  const isLoading = useMoviesStore((s) => s.isLoading);
  const error = useMoviesStore((s) => s.error);
  const isFallback = useMoviesStore((s) => s.isFallbackRecommendations);
  const selectedMovie = useMoviesStore((s) => s.selectedMovie);

  const fetchRecommendations = useMoviesStore((s) => s.fetchRecommendations);
  const openMovieDetails = useMoviesStore((s) => s.openMovieDetails);
  const closeMovieDetails = useMoviesStore((s) => s.closeMovieDetails);
  const rateMovie = useMoviesStore((s) => s.rateMovie);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return (
    <div className="flex flex-col justify-between w-full min-h-[calc(100vh-72px)] bg-background text-foreground p-6 md:p-8 gap-8 transition-colors">
      <div className="flex flex-col gap-6">
        
        {/* ШАПКА СТРАНИЦЫ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-[#FF6B00] uppercase">
              {isFallback ? "Стартовая подборка" : "Персональный алгоритм"}
            </span>
            <div className="flex items-center gap-2.5 mt-0.5">
              <Sparkles className="h-6 w-6 text-[#FF6B00]" />
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Рекомендации для вас
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isFallback
                ? "Популярные фильмы с высоким рейтингом на основе ваших жанров"
                : "Сформировано моделью коллаборативной фильтрации на основе ваших оценок"}
            </p>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => fetchRecommendations()}
            className="self-start sm:self-auto flex items-center gap-2 rounded-xl border border-border bg-card hover:border-[#FF6B00] px-4 py-2.5 text-xs font-bold text-foreground transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-[#FF6B00] ${isLoading ? "animate-spin" : ""}`} />
            <span>Обновить</span>
          </button>
        </div>

        {/* БАННЕР-ПОДСКАЗКА ДЛЯ НОВОГО ПОЛЬЗОВАТЕЛЯ (ХОЛОДНЫЙ СТАРТ) */}
        {!isLoading && isFallback && movies.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#FF6B00]/25 bg-[#FF6B00]/10 px-5 py-4">
            <div className="flex items-start sm:items-center gap-3">
              <Info className="h-5 w-5 text-[#FF6B00] shrink-0 mt-0.5 sm:mt-0" />
              <div className="text-xs">
                <p className="font-bold text-foreground">
                  Алгоритм ещё изучает ваши вкусы
                </p>
                <p className="text-muted-foreground mt-0.5">
                  Оцените несколько фильмов кнопками «Нравится» или «Мимо», чтобы после переобучения модели получить персональные рекомендации.
                </p>
              </div>
            </div>

            <Link
              to="/films"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] px-4 py-2 text-xs font-bold text-white transition-colors"
            >
              <Film className="h-3.5 w-3.5" />
              <span>В каталог</span>
            </Link>
          </div>
        )}

        {/* ОШИБКА */}
        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* СЕТКА ФИЛЬМОВ */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 animate-pulse">
                <div className="aspect-[2/2.8] w-full rounded-xl bg-card" />
                <div className="h-4 w-3/4 rounded bg-card" />
                <div className="h-3 w-1/2 rounded bg-card" />
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-card border border-border px-4">
            <Sparkles className="h-8 w-8 text-[#FF6B00] mb-3 opacity-80" />
            <p className="text-base font-bold">Подборка пока пуста</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-md">
              Перейдите в общий каталог и поставьте лайк нескольким любимым фильмам, чтобы мы могли сформировать для вас рекомендации.
            </p>
            <Link
              to="/films"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] px-5 py-2.5 text-xs font-bold text-white transition-colors"
            >
              <span>Перейти к фильмам</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => openMovieDetails(movie.movie_external_id)}
                onLike={(m) => rateMovie(m, 1)}
                onPass={(m) => rateMovie(m, -1)}
              />
            ))}
          </div>
        )}
      </div>

      {/* МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ ФИЛЬМА */}
      <MovieDetailModal
        movie={selectedMovie}
        onClose={closeMovieDetails}
        onLike={(m) => rateMovie(m, 1)}
        onPass={(m) => rateMovie(m, -1)}
      />
    </div>
  );
}
