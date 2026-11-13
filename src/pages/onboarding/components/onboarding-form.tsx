import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Check, ChevronRight } from "lucide-react";
import { useMoviesStore } from "@/stores/movie-store";
import { BrandLogo } from "@/components/app-header";

export function OnboardingForm() {
  const navigate = useNavigate();

  const genres = useMoviesStore((s) => s.genres) ?? [];
  const isGenresLoading = useMoviesStore((s) => s.isGenresLoading);
  const fetchGenres = useMoviesStore((s) => s.fetchGenres);
  const setSelectedGenres = useMoviesStore((s) => s.setSelectedGenres);

  // Храним название выбранного жанра (string), так как бэкенд фильтрует по имени жанра
  const [chosenGenres, setChosenGenres] = useState<string[]>([]);


  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const handleToggle = (genreName: string) => {
  setChosenGenres((prev) =>
    prev.includes(genreName) ? prev.filter((item) => item !== genreName) : [...prev, genreName]
  );
};

  const handleSubmit = () => {
  if (chosenGenres.length < 3) return;
  setSelectedGenres(chosenGenres);
  navigate("/films", { replace: true });
};

  const handleSkip = () => {
    setSelectedGenres([]);
    navigate("/films", { replace: true });
};

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-background text-foreground transition-colors">
      <div className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-[#FF6B00]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-[#FF6B00]/10 blur-3xl" />

      <header className="relative z-10 flex h-[72px] w-full items-center justify-between border-b border-border px-6 md:px-10">
        <BrandLogo />
        <button
          type="button"
          onClick={handleSkip}
          className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          Пропустить шаг
        </button>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FF6B00]/30 bg-[#FF6B00]/10 text-[#FF6B00]">
          <Sparkles className="h-6 w-6" />
        </div>

        <span className="text-[10px] font-extrabold tracking-widest text-[#FF6B00] uppercase mb-2">
          НАСТРОЙКА РЕКОМЕНДАЦИЙ
        </span>

        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          Что вы хотите посмотреть сейчас?
        </h1>

        <p className="mt-2.5 max-w-md text-xs md:text-sm text-muted-foreground leading-relaxed">
          Выберите любимый жанр для старта. Мы сразу отфильтруем каталог, чтобы вы могли оценить подходящие фильмы.
        </p>

        <div className="my-8 w-full">
          {isGenresLoading ? (
            <div className="flex flex-wrap justify-center gap-3 animate-pulse">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-11 w-28 rounded-xl bg-card border border-border" />
              ))}
            </div>
            ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {genres.map((genre) => {
                const isSelected = chosenGenres.includes(genre.name);
                return (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => handleToggle(genre.name)}
                    className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-xs md:text-sm font-bold transition-all cursor-pointer select-none ${
                      isSelected
                        ? "border-[#FF6B00] bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/25 scale-105"
                        : "border-border bg-card text-foreground hover:border-[#FF6B00]/50 hover:bg-muted/50"
                    }`}
                  >
                    {isSelected && <Check className="h-4 w-4 stroke-[2.5]" />}
                    <span>{genre.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>        
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          <button
            type="button"
            disabled={chosenGenres.length < 3}
            onClick={handleSubmit}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B00] hover:bg-[#ff7b1a] px-6 text-xs md:text-sm font-bold text-white shadow-lg shadow-[#FF6B00]/20 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
          >
            <span>
              {chosenGenres.length < 3
                ? `Выберите ещё ${3 - chosenGenres.length}`
                : "Перейти к подборке"}
            </span>
            {chosenGenres.length >= 3 && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </main>

      <footer className="relative z-10 flex h-14 items-center justify-center border-t border-border/50 text-[11px] text-muted-foreground">
        Вы всегда сможете изменить фильтры в каталоге
      </footer>
    </div>
  );
}
