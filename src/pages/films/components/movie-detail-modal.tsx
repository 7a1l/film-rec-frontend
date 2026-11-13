import { X, Star, ThumbsUp, ThumbsDown, Calendar, Clock, Globe } from "lucide-react";
import type { Movie } from "@/shared/api/types";

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  onLike?: (movie: Movie) => void;
  onPass?: (movie: Movie) => void;
}

export function MovieDetailModal({ movie, onClose, onLike, onPass }: MovieDetailModalProps) {
  if (!movie) return null;

  const genresText = movie.genres?.map((g) => g.name).join(", ") || "Кино";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col md:flex-row w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl text-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="w-full md:w-2/5 aspect-[2/3] bg-background shrink-0">
          {movie.poster_url ? (
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              Нет постера
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between p-6 md:p-7 gap-5 flex-1">
          <div className="flex flex-col gap-3">
            {/* Рейтинги КП и IMDb */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              {typeof movie.rating_kinopoisk === "number" && movie.rating_kinopoisk > 0 && (
                <span className="flex items-center gap-1 rounded-md bg-[#FF6B00]/15 text-[#FF6B00] px-2 py-0.5 border border-[#FF6B00]/30">
                  <Star className="h-3 w-3 fill-[#FF6B00]" />
                  КП {movie.rating_kinopoisk.toFixed(1)}
                </span>
              )}
              {typeof movie.rating_imdb === "number" && movie.rating_imdb > 0 && (
                <span className="flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-foreground">
                  IMDb {movie.rating_imdb.toFixed(1)}
                </span>
              )}
              <span className="text-muted-foreground font-medium">{genresText}</span>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold leading-tight">{movie.title}</h2>
              {movie.title_original && (
                <p className="text-xs text-muted-foreground mt-0.5">{movie.title_original}</p>
              )}
            </div>

            {/* Метаданные: год, длительность, страна */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {movie.year && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> {movie.year}
                </span>
              )}
              {movie.film_length && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {movie.film_length} мин.
                </span>
              )}
              {movie.countries && (
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" /> {movie.countries}
                </span>
              )}
            </div>

            {movie.slogan && (
              <p className="text-xs italic text-[#FF6B00] mt-1">«{movie.slogan}»</p>
            )}

            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mt-1">
              {movie.description || "Описание для этого фильма пока не добавлено."}
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => {
                onLike?.(movie);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white py-2.5 text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-[#FF6B00]/20"
            >
              <ThumbsUp className="h-4 w-4" />
              <span>Нравится</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onPass?.(movie);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground py-2.5 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ThumbsDown className="h-4 w-4 text-muted-foreground" />
              <span>Не интересно</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
