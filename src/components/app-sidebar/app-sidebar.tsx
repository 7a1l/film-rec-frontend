import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Film, Sparkles, Settings, SlidersHorizontal } from "lucide-react";
import { useMoviesStore } from "@/stores/movie-store";

interface AppSideBarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AppSideBar({ mobileOpen = false, onCloseMobile }: AppSideBarProps) {
  const genres = useMoviesStore((s) => s.genres);
  const selectedGenres = useMoviesStore((s) => s.selectedGenres);
  const toggleGenre = useMoviesStore((s) => s.toggleGenre);
  const isGenresLoading = useMoviesStore((s) => s.isGenresLoading);
  const fetchGenres = useMoviesStore((s) => s.fetchGenres);
  const resetGenres = useMoviesStore((s) => s.resetGenres);

  // Берём годы и метод их обновления из общего стора
  const yearFrom = useMoviesStore((s) => s.yearFrom);
  const yearTo = useMoviesStore((s) => s.yearTo);
  const setYearRange = useMoviesStore((s) => s.setYearRange);

  const MIN_YEAR = 1950;
  const MAX_YEAR = 2026;

  const numFrom = Math.max(MIN_YEAR, Math.min(Number(yearFrom) || MIN_YEAR, Number(yearTo) || MAX_YEAR));
  const numTo = Math.min(MAX_YEAR, Math.max(Number(yearTo) || MAX_YEAR, numFrom));

// Вычисляем отступ слева и ширину оранжевой полосы в процентах
  const leftPercent = ((numFrom - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
  const widthPercent = ((numTo - numFrom) / (MAX_YEAR - MIN_YEAR)) * 100;
  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const handleReset = () => {
    resetGenres();
  };

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-[72px] left-0 z-30 flex h-[calc(100vh-72px)] w-64 shrink-0 flex-col justify-between border-r border-border bg-card/60 backdrop-blur-md p-5 transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col gap-6 overflow-y-auto pr-1">
          {/* Верхнее меню: только Фильмы и Рекомендации */}
          <nav className="flex flex-col gap-1.5 pb-5 border-b border-border">
            <NavLink
              to="/films"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#FF6B00]/15 text-[#FF6B00]"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`
              }
            >
              <Film className="h-4 w-4" />
              <span>Фильмы</span>
            </NavLink>

            <NavLink
              to="/recomendations"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#FF6B00]/15 text-[#FF6B00]"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`
              }
            >
              <Sparkles className="h-4 w-4" />
              <span>Рекомендации</span>
            </NavLink>
          </nav>

          {/* Фильтры: только Год и Жанры */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[11px] font-extrabold tracking-wider uppercase text-foreground">
                <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                Фильтры
              </span>
              {(selectedGenres.length > 0 || yearFrom !== "1990" || yearTo !== "2026") && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] font-bold text-[#FF6B00] hover:underline cursor-pointer"
                >
                  Сбросить
                </button>
              )}
            </div>

            {/* Год выпуска с живым двойным ползунком */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                Год выпуска
              </label>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <input
                  type="number"
                  value={yearFrom}
                  min={MIN_YEAR}
                  max={numTo}
                  onChange={(e) => setYearRange(e.target.value, yearTo)}
                  className="h-9 w-full rounded-lg border border-border bg-background text-center text-xs font-semibold text-foreground outline-none focus:border-[#FF6B00]"
                />
                <span className="text-xs text-muted-foreground">—</span>
                <input
                  type="number"
                  value={yearTo}
                  min={numFrom}
                  max={MAX_YEAR}
                  onChange={(e) => setYearRange(yearFrom, e.target.value)}
                  className="h-9 w-full rounded-lg border border-border bg-background text-center text-xs font-semibold text-foreground outline-none focus:border-[#FF6B00]"
                />
              </div>

              {/* Интерактивный двойной слайдер */}
              <div className="relative mt-3 flex h-4 w-full items-center select-none">
                {/* Серая подложка */}
                <div className="h-1 w-full rounded-full bg-muted" />

                {/* Динамическая оранжевая полоса */}
                <div
                  className="absolute h-1 rounded-full bg-[#FF6B00]"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                />

                {/* Левый ползунок (От) */}
                <input
                  type="range"
                  min={MIN_YEAR}
                  max={MAX_YEAR}
                  value={numFrom}
                  onChange={(e) => {
                    const val = Math.min(Number(e.target.value), numTo);
                    setYearRange(String(val), yearTo);
                  }}
                  className="pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF6B00] [&::-webkit-slider-thumb]:shadow-md"
                />

                {/* Правый ползунок (До) */}
                <input
                  type="range"
                  min={MIN_YEAR}
                  max={MAX_YEAR}
                  value={numTo}
                  onChange={(e) => {
                    const val = Math.max(Number(e.target.value), numFrom);
                    setYearRange(yearFrom, String(val));
                  }}
                  className="pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF6B00] [&::-webkit-slider-thumb]:shadow-md"
                />
              </div>
            </div>

            {/* Жанры из API */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                Жанры
              </label>
              {isGenresLoading ? (
                <span className="text-xs text-muted-foreground animate-pulse">Загрузка...</span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {genres.map((g) => {
                    const active = selectedGenres.includes(g.name);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => toggleGenre(g.name)}
                        className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
                          active
                            ? "border-[#FF6B00] bg-[#FF6B00] text-white shadow-sm"
                            : "border-border bg-background text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {g.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ссылка на профиль внизу */}
        <NavLink
          to="/user/me"
          onClick={onCloseMobile}
          className="mt-4 flex items-center gap-2.5 border-t border-border pt-4 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>Настройки профиля</span>
        </NavLink>
      </aside>
    </>
  );
}
