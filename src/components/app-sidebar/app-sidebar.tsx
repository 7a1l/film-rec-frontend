import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Film, Sparkles, Settings, SlidersHorizontal, Sun, Moon, Monitor } from "lucide-react";
import { useMoviesStore } from "@/stores/movie-store";
import { useTheme } from "@/components/theme-provider";

export function AppSideBar() {
  const { theme, setTheme } = useTheme();

  const genres = useMoviesStore((s) => s.genres);
  const selectedGenreIds = useMoviesStore((s) => s.selectedGenreIds);
  const isGenresLoading = useMoviesStore((s) => s.isGenresLoading);
  const fetchGenres = useMoviesStore((s) => s.fetchGenres);
  const toggleGenre = useMoviesStore((s) => s.toggleGenre);
  const resetGenres = useMoviesStore((s) => s.resetGenres);

  const [yearFrom, setYearFrom] = useState("1990");
  const [yearTo, setYearTo] = useState("2026");

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const handleResetAll = () => {
    resetGenres();
    setYearFrom("1990");
    setYearTo("2026");
  };

  const cycleTheme = () => {
    if (theme === "system") setTheme("dark");
    else if (theme === "dark") setTheme("light");
    else setTheme("system");
  };

  return (
    <aside className="flex flex-col w-64 shrink-0 min-h-screen border-r border-border bg-card text-foreground select-none transition-colors">
      {/* ЛОГОТИП */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#FF6B00] text-[#FF6B00] font-black text-sm">
            ••
          </div>
          <span className="text-xl font-black tracking-wider">
            MOVIE<span className="text-[#FF6B00]">PICK</span>
          </span>
        </div>
      </div>

      <div className="flex-1 px-3 flex flex-col gap-6 overflow-y-auto">
        {/* ВЕРХНЯЯ НАВИГАЦИЯ */}
        <nav className="flex flex-col gap-1.5">
          <NavLink
            to="/films"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`
            }
          >
            <Film className="h-4 w-4" />
            <span>Фильмы</span>
          </NavLink>

          <NavLink
            to="/recomendations"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`
            }
          >
            <Sparkles className="h-4 w-4" />
            <span>Рекомендации</span>
          </NavLink>
        </nav>

        <div className="h-[1px] bg-border mx-2" />

        {/* ФИЛЬТРЫ: ГОД ВЫПУСКА И ЖАНРЫ */}
        <div className="px-2 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Фильтры</span>
            </div>
            
            {(selectedGenreIds.length > 0 || yearFrom !== "1990" || yearTo !== "2026") && (
              <button
                type="button"
                onClick={handleResetAll}
                className="text-xs font-semibold text-[#FF6B00] hover:underline cursor-pointer bg-transparent border-0"
              >
                Сбросить
              </button>
            )}
          </div>

          {/* ГОД ВЫПУСКА */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Год выпуска
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                min={1900}
                max={2030}
                className="w-full rounded-lg bg-background border border-border px-2.5 py-1.5 text-xs text-center font-medium outline-none focus:border-[#FF6B00]"
              />
              <span className="text-muted-foreground text-xs">—</span>
              <input
                type="number"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                min={1900}
                max={2030}
                className="w-full rounded-lg bg-background border border-border px-2.5 py-1.5 text-xs text-center font-medium outline-none focus:border-[#FF6B00]"
              />
            </div>
          </div>

          {/* ЖАНРЫ */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Жанры
            </span>

            {isGenresLoading ? (
              <div className="text-xs text-muted-foreground animate-pulse">
                Загрузка жанров...
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => {
                  const isSelected = selectedGenreIds.includes(genre.id);
                  return (
                    <button
                      key={genre.id}
                      type="button"
                      onClick={() => toggleGenre(genre.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#FF6B00] text-white border-[#FF6B00] shadow-md shadow-[#FF6B00]/20"
                          : "bg-background text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      {genre.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* НИЖНЯЯ ПАНЕЛЬ: ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ И ПРОФИЛЬ */}
      <div className="p-4 border-t border-border flex flex-col gap-1.5">
        <NavLink
          to="/user/me"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              isActive
                ? "text-[#FF6B00] bg-[#FF6B00]/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`
          }
        >
          <Settings className="h-4 w-4" />
          <span>Настройки профиля</span>
        </NavLink>
      </div>
    </aside>
  );
}
