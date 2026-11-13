import { ThumbsUp, ThumbsDown, Star } from "lucide-react";

export type Movie = {
  id: number | string;
  title: string;
  year: number;
  genre: string;
  rating: number;
  posterUrl?: string;
};

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
  onLike?: (id: number | string) => void;
  onPass?: (id: number | string) => void;
}

export function MovieCard({ movie, onClick, onLike, onPass }: MovieCardProps) {
  return (
    <div 
      onClick={() => onClick?.(movie)}
      className="group flex flex-col gap-3 select-none cursor-pointer"
    >
      {/* ПОСТЕР И КНОПКИ ВЗАИМОДЕЙСТВИЯ */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-[#1E1E22] border border-border/60 transition-all duration-300 group-hover:border-[#FF6B00]/50">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            Нет постера
          </div>
        )}

        {/* ПЛАШКА РЕЙТИНГА */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-[#121214]/90 backdrop-blur-md px-2 py-1 text-xs font-bold text-white border border-white/10">
          <Star className="h-3 w-3 fill-[#FF6B00] text-[#FF6B00]" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>

        {/* КНОПКИ LIKE / PASS ПРИ НАВЕДЕНИИ */}
        <div className="absolute inset-x-0 bottom-0 flex gap-2 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(movie.id);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white py-2 text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-[#FF6B00]/20"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>Like</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPass?.(movie.id);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#27272A]/90 hover:bg-[#3F3F46] text-white py-2 text-xs font-semibold transition-colors border border-white/10 cursor-pointer"
          >
            <ThumbsDown className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Pass</span>
          </button>
        </div>
      </div>

      {/* ИНФОРМАЦИЯ ПОД ПОСТЕРОМ */}
      <div className="flex flex-col gap-0.5 px-1">
        <h3 className="text-sm font-bold text-white truncate group-hover:text-[#FF6B00] transition-colors">
          {movie.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {movie.year} • {movie.genre}
        </p>
      </div>
    </div>
  );
}
