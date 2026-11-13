import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight, Menu, Star, X, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useMoviesStore } from "@/stores/movie-store";
import { moviesApi } from "@/shared/api/movies-api";
import type { Movie } from "@/shared/api/types";

export function BrandLogo() {
  return (
    <Link to="/films" className="inline-flex items-center gap-2.5 select-none group">
      <span className="relative flex h-7 w-7 items-center justify-center rounded-full rounded-bl-sm border-2 border-[#FF6B00] -rotate-12 transition-transform group-hover:rotate-0">
        <span className="absolute top-1 left-1.5 h-1 w-1 rounded-full bg-[#FF6B00]" />
        <span className="absolute top-1.5 right-1 h-1 w-1 rounded-full bg-[#FF6B00]" />
        <span className="absolute bottom-1 left-2.5 h-1 w-1 rounded-full bg-[#FF6B00]" />
      </span>
      <span className="text-lg font-extrabold tracking-tight text-foreground">
        MOVIE<span className="text-[#FF6B00]">PICK</span>
      </span>
    </Link>
  );
}

interface AppHeaderProps {
  onToggleMobileMenu?: () => void;
}

export function AppHeader({ onToggleMobileMenu }: AppHeaderProps) {
  const user = useAuthStore((s) => s.user);
  const searchQuery = useMoviesStore((s) => s.searchQuery);
  const setSearchQuery = useMoviesStore((s) => s.setSearchQuery);
  const openMovieDetails = useMoviesStore((s) => s.openMovieDetails);

  // Локальные состояния для живого выпадающего поиска
  const [results, setResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();

  // 1. Закрываем выпадающее окно при клике мимо строки поиска
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. Живой поиск с задержкой 350 мс при вводе текста
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setResults([]);
      setIsDropdownOpen(false);
      return;
    }

    setIsDropdownOpen(true);
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const list = await moviesApi.getMovies({
          search: trimmed,
          page: 1,
          limit: 6, // Показываем топ-6 совпадений в выпадающем списке
        });
        setResults(Array.isArray(list) ? list : []);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectMovie = (movie: Movie) => {
    setIsDropdownOpen(false);
    openMovieDetails(movie.movie_external_id);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 flex h-[72px] w-full items-center justify-between gap-4 border-b border-border bg-background/85 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4 shrink-0">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Открыть меню"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <BrandLogo />
      </div>

      {/* КОНТЕЙНЕР ПОИСКА С ВЫПАДАЮЩИМ ОКНОМ */}
      <div ref={searchContainerRef} className="hidden sm:block relative w-full max-w-md">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => {
              if (searchQuery.trim()) setIsDropdownOpen(true);
            }}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск фильмов, жанров, актёров..."
            className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-9 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-[#FF6B00]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Очистить поиск"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* ВСПЛЫВАЮЩЕЕ ОКНО РЕЗУЛЬТАТОВ ПОИСКА */}
        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl backdrop-blur-xl">
            {isSearching ? (
              <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-[#FF6B00]" />
                <span>Ищем фильмы...</span>
              </div>
            ) : results.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                По запросу «{searchQuery}» ничего не найдено
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-border/60 max-h-[380px] overflow-y-auto">
                {results.map((movie) => {
                  const rating = movie.rating_kinopoisk ?? movie.rating_imdb;
                  const genresText = movie.genres?.map((g) => g.name).join(", ");

                  return (
                    <button
                      key={movie.id}
                      type="button"
                      onClick={() => handleSelectMovie(movie)}
                      className="flex items-center gap-3.5 p-3 text-left transition-colors hover:bg-muted/60 cursor-pointer"
                    >
                      {/* Мини-постер */}
                      <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-background border border-border">
                        {movie.poster_url ? (
                          <img
                            src={movie.poster_url}
                            alt={movie.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[9px] text-muted-foreground">
                            Нет фото
                          </div>
                        )}
                      </div>

                      {/* Название, год, жанры */}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-xs font-bold text-foreground">
                          {movie.title}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground mt-0.5">
                          {movie.year ? `${movie.year}` : ""}
                          {movie.year && genresText ? " • " : ""}
                          {genresText}
                        </p>
                      </div>

                      {/* Рейтинг справа */}
                      {typeof rating === "number" && rating > 0 && (
                        <div className="flex items-center gap-1 rounded-md bg-[#FF6B00]/15 px-2 py-1 text-[11px] font-bold text-[#FF6B00] shrink-0">
                          <Star className="h-3 w-3 fill-[#FF6B00]" />
                          <span>{rating.toFixed(1)}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Профиль справа */}
      <Link
        to="/user/me"
        className="flex items-center gap-3 rounded-xl border border-transparent hover:border-border hover:bg-card px-2.5 py-1.5 transition-all shrink-0"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FF6B00]/40 bg-[#FF6B00]/15 text-xs font-extrabold text-[#FF6B00]">
          {initials}
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold leading-none text-foreground">
            {user?.name || "Пользователь"}
          </span>
          <span className="text-[10px] text-muted-foreground mt-1">
            {user?.email}
          </span>
        </div>
        <ChevronRight className="hidden md:block h-4 w-4 text-muted-foreground" />
      </Link>
    </header>
  );
}
