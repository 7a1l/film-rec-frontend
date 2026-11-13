import { ThumbsUp, ThumbsDown, Star } from "lucide-react";
import type { Movie } from "@/shared/api/types";

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
  onLike?: (movie: Movie) => void;
  onPass?: (movie: Movie) => void;
}

export function MovieCard({ movie, onClick, onLike, onPass }: MovieCardProps) {
  // Берём рейтинг Кинопоиска, если нет — IMDb
  const displayRating = movie.rating_kinopoisk ?? movie.rating_imdb;
  const genresText = movie.genres?.map((g) => g.name).join(", ") || "Кино";

  return (
    <div
      onClick={() => onClick?.(movie)}
      className="group flex flex-col gap-2.5 select-none cursor-pointer"
    >
      <div className="relative aspect-[2/2.8] w-full overflow-hidden rounded-xl bg-card border border-border transition-all duration-300 group-hover:border-[#FF6B00]/50">
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            Нет постера
          </div>
        )}

        {/* ПЛАШКА РЕЙТИНГА (показываем только если рейтинг есть) */}
        {typeof displayRating === "number" && displayRating > 0 && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-md bg-black/80 backdrop-blur-md px-2 py-1 text-[11px] font-bold text-white border border-white/10">
            <Star className="h-3 w-3 fill-[#FF6B00] text-[#FF6B00]" />
            <span>{displayRating.toFixed(1)}</span>
          </div>
        )}

        {/* КНОПКИ ПРИ НАВЕДЕНИИ (ПК) */}
        <div className="hidden md:flex absolute inset-x-0 bottom-0 gap-2 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(movie);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#FF6B00] hover:bg-[#e05e00] text-white py-2 text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-[#FF6B00]/20"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>Нравится</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPass?.(movie);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#1E1E22]/90 hover:bg-[#27272A] text-white py-2 text-xs font-semibold transition-colors border border-white/15 cursor-pointer"
          >
            <ThumbsDown className="h-3.5 w-3.5 text-zinc-400" />
            <span>Мимо</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 px-0.5">
        <h3 className="text-xs font-bold text-foreground truncate group-hover:text-[#FF6B00] transition-colors">
          {movie.title}
        </h3>
        <p className="text-[11px] text-muted-foreground truncate">
          {movie.year ? `${movie.year} • ` : ""}{genresText}
        </p>
      </div>

      {/* КНОПКИ ДЛЯ МОБИЛЬНЫХ */}
      <div className="grid grid-cols-2 gap-1.5 md:hidden mt-0.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLike?.(movie);
          }}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-[#FF6B00] text-white py-2 text-[11px] font-bold active:scale-95 transition-transform"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          <span>Нравится</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPass?.(movie);
          }}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-card border border-border text-foreground py-2 text-[11px] font-semibold active:scale-95 transition-transform"
        >
          <ThumbsDown className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Мимо</span>
        </button>
      </div>
    </div>
  );
}
