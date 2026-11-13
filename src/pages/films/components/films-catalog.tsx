import { useEffect, useState } from "react";
import { ChevronDown, Play, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useMoviesStore } from "@/stores/movie-store";
import { MovieCard } from "./movie-card";
import { Pagination } from "./pagination";
import { MovieDetailModal } from "./movie-detail-modal";

export function FilmsCatalog() {
  const movies = useMoviesStore((s) => s.movies) ?? [];
  const isLoading = useMoviesStore((s) => s.isLoading);
  const error = useMoviesStore((s) => s.error);
  const sortBy = useMoviesStore((s) => s.sortBy);
  const currentPage = useMoviesStore((s) => s.currentPage);
  const hasMorePages = useMoviesStore((s) => s.hasMorePages);
  const selectedMovie = useMoviesStore((s) => s.selectedMovie);

  const fetchMovies = useMoviesStore((s) => s.fetchMovies);
  const setSortBy = useMoviesStore((s) => s.setSortBy);
  const setPage = useMoviesStore((s) => s.setPage);
  const openMovieDetails = useMoviesStore((s) => s.openMovieDetails);
  const closeMovieDetails = useMoviesStore((s) => s.closeMovieDetails);
  const rateMovie = useMoviesStore((s) => s.rateMovie);

  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(page);
  };

  const heroMovies = movies.slice(0, 3);
  const currentHero = heroMovies[heroIndex];

  return (
    <div className="flex flex-col justify-between w-full min-h-[calc(100vh-72px)] bg-background text-foreground p-6 md:p-8 gap-8 transition-colors">
      <div className="flex flex-col gap-8">
        
        {/* 1. СЕКЦИЯ HERO: ВАШИ ПЕРСОНАЛЬНЫЕ ТОП-РЕКОМЕНДАЦИИ */}
        {currentHero && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-[#FF6B00] uppercase">
                  Подобрано для вас
                </span>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  Ваши персональные топ-рекомендации
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Сформировано на основе ваших предпочтений, обновляется ежедневно
                </p>
              </div>

              {heroMovies.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHeroIndex((prev) => (prev === 0 ? heroMovies.length - 1 : prev - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border hover:border-[#FF6B00] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroIndex((prev) => (prev === heroMovies.length - 1 ? 0 : prev + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border hover:border-[#FF6B00] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 md:p-10 min-h-[280px] flex flex-col justify-end">
              {currentHero.poster_url && (
                <img
                  src={currentHero.poster_url}
                  alt={currentHero.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-25 pointer-events-none"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-transparent pointer-events-none" />

              <div className="relative z-10 max-w-xl flex flex-col gap-3">
                <div className="inline-flex items-center gap-1.5 self-start rounded-md bg-[#FF6B00]/15 border border-[#FF6B00]/30 px-2.5 py-1 text-[10px] font-bold text-[#FF6B00] uppercase">
                  <Sparkles className="h-3 w-3" />
                  <span>98% Совпадение</span>
                </div>

                <h3 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
                  {currentHero.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  {currentHero.year && <span>{currentHero.year}</span>}
                  {currentHero.year && <span>•</span>}
                  <span>{currentHero.genres?.map((g) => g.name).join(" • ") || "Кино"}</span>
                </div>

                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mt-1">
                  {currentHero.description || "Откройте для себя историю, подобранную специально под ваш вкус."}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => openMovieDetails(currentHero.movie_external_id)}
                    className="flex items-center gap-2 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white px-5 py-2.5 text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-[#FF6B00]/20"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>Подробнее</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. СЕКЦИЯ ОБЗОР ФИЛЬМОВ */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                Обзор фильмов
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Каталог фильмов с учётом выбранных фильтров
              </p>
            </div>

            <div className="relative self-start sm:self-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-xl bg-card hover:bg-muted/50 text-foreground pl-4 pr-9 py-2 text-xs font-semibold border border-border transition-colors cursor-pointer outline-none"
              >
                <option value="For you">Для вас</option>
                <option value="rating">По рейтингу</option>
                <option value="year">Новинки</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

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
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-card border border-border">
              <p className="text-base font-semibold">Фильмы не найдены</p>
              <p className="text-xs text-muted-foreground mt-1">
                Попробуйте изменить запрос или сбросить выбранные жанры в меню слева
              </p>
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
      </div>

      {/* ПАГИНАЦИЯ */}
      <Pagination
        currentPage={currentPage}
        totalPages={hasMorePages ? currentPage + 1 : currentPage}
        onPageChange={handlePageChange}
      />

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
