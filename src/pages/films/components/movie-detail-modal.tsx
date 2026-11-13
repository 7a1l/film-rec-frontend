import { X, Star, ThumbsUp, ThumbsDown, Calendar, Clock } from "lucide-react";
import type { Movie } from "@/pages/films/components/movie-card";

export type MovieDetails = Movie & {
  description?: string;
  duration?: string;
  director?: string;
  actors?: string[];
};

interface MovieDetailModalProps {
  movie: MovieDetails | null;
  onClose: () => void;
  onLike?: (id: number | string) => void;
  onPass?: (id: number | string) => void;
}

export function MovieDetailModal({ movie, onClose, onLike, onPass }: MovieDetailModalProps) {
  if (!movie) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative flex flex-col md:flex-row w-full max-w-2xl overflow-hidden rounded-2xl bg-[#1E1E22] border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-muted-foreground hover:text-white hover:bg-black transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="w-full md:w-2/5 aspect-[2/3] bg-[#121214] shrink-0">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              Нет постера
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between p-6 md:p-7 gap-6 flex-1">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <span className="flex items-center gap-1 rounded-md bg-[#FF6B00]/15 text-[#FF6B00] px-2 py-0.5 border border-[#FF6B00]/30">
                <Star className="h-3 w-3 fill-[#FF6B00]" />
                {movie.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">{movie.genre}</span>
            </div>

            <h2 className="text-2xl font-bold text-white leading-tight">
              {movie.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {movie.year}
              </span>
              {movie.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {movie.duration}
                </span>
              )}
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed mt-2">
              {movie.description || "Описание для этого фильма скоро появится. Следите за обновлениями каталога MOVIEPICK."}
            </p>

            {movie.director && (
              <div className="text-xs text-muted-foreground mt-2">
                <span className="text-white font-medium">Режиссер:</span> {movie.director}
              </div>
            )}
            {movie.actors && movie.actors.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <span className="text-white font-medium">В ролях:</span> {movie.actors.join(", ")}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-border/60">
            <button
              type="button"
              onClick={() => {
                onLike?.(movie.id);
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
                onPass?.(movie.id);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-white py-2.5 text-xs font-semibold transition-colors border border-white/10 cursor-pointer"
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
