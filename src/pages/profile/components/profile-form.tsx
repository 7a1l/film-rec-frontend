import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ShieldCheck, ArrowLeft, Eye, EyeOff, Heart, Trash2, Star } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useMoviesStore } from "@/stores/movie-store";
import { AuthFormErrorAlert } from "@/pages/auth/components/auth-form-error-alert";
import { BrandLogo } from "@/components/app-header";
import { MovieDetailModal } from "@/pages/films/components/movie-detail-modal";

export function ProfileForm() {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);
  const authError = useAuthStore((s) => s.AuthError);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const updatePassword = useAuthStore((s) => s.updatePassword);
  const logout = useAuthStore((s) => s.logout);

  const likedMovies = useMoviesStore((s) => s.likedMovies) ?? [];
  const fetchLikedMovies = useMoviesStore((s) => s.fetchLikedMovies);
  const removeLikedMovie = useMoviesStore((s) => s.removeLikedMovie);
  const selectedMovie = useMoviesStore((s) => s.selectedMovie);
  const openMovieDetails = useMoviesStore((s) => s.openMovieDetails);
  const closeMovieDetails = useMoviesStore((s) => s.closeMovieDetails);
  const rateMovie = useMoviesStore((s) => s.rateMovie);

  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [showPass3, setShowPass3] = useState(false);

  useEffect(() => {
    fetchLikedMovies();
  }, [fetchLikedMovies]);

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailSuccess(null);
    useAuthStore.getState().clearAuthError();

    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    if (!email || email === user?.email) return;

    try {
      await updateProfile({ email });
      setEmailSuccess("Письмо с подтверждением отправлено на новый адрес!");
      form.reset();
    } catch {}
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setLocalError(null);
    useAuthStore.getState().clearAuthError();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const old_password = String(formData.get("old_password") ?? "");
    const new_password = String(formData.get("new_password") ?? "");
    const confirm_password = String(formData.get("confirm_password") ?? "");

    if (new_password !== confirm_password) {
      setLocalError("Новые пароли не совпадают");
      return;
    }

    try {
      await updatePassword({ old_password, new_password });
      setPasswordSuccess("Пароль успешно изменён!");
      form.reset();
    } catch {}
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      {/* Шапка профиля */}
      <header className="flex h-[72px] items-center justify-between border-b border-border bg-background/85 px-6 md:px-10 backdrop-blur-md">
        <BrandLogo />
        <Link
          to="/films"
          className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Назад к фильмам</span>
        </Link>
      </header>

      <main className="mx-auto w-full max-w-4xl px-6 py-10 flex flex-col gap-6">
        <div>
          <span className="block text-[10px] font-extrabold tracking-widest text-[#FF6B00] uppercase mb-1.5">
            Настройки аккаунта
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Ваш профиль</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Управление личными данными и безопасностью вашего аккаунта.
          </p>
        </div>

        <AuthFormErrorAlert message={localError || authError} />

        {/* Широкая карточка пользователя */}
        <section className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#FF6B00]/40 bg-[#FF6B00]/10 text-xl font-extrabold text-[#FF6B00]">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-bold">{user?.name || "Пользователь"}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
          </div>
        </section>

        {/* Блок лайкнутых фильмов в строку */}
        <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF6B00]/15 text-[#FF6B00]">
                <Heart className="h-4 w-4 fill-[#FF6B00]" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Понравившиеся фильмы</h3>
                <p className="text-[11px] text-muted-foreground">
                  Нажмите на постер для подробностей или удалите из списка
                </p>
              </div>
            </div>
            <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-bold text-foreground">
              {likedMovies.length}
            </span>
          </div>

          {likedMovies.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
              Вы пока не оценили ни одного фильма. Нажмите «Нравится» на любом фильме в каталоге!
            </div>
          ) : (
            <div className="flex gap-3.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
              {likedMovies.map((movie) => {
                const rating = movie.rating_kinopoisk ?? movie.rating_imdb;
                return (
                  <div
                    key={movie.id}
                    onClick={() => openMovieDetails(movie.movie_external_id)}
                    className="group relative flex w-32 shrink-0 flex-col gap-2 cursor-pointer select-none"
                  >
                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-border bg-background transition-all group-hover:border-[#FF6B00]">
                      {movie.poster_url ? (
                        <img
                          src={movie.poster_url}
                          alt={movie.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                          Нет постера
                        </div>
                      )}

                      {typeof rating === "number" && rating > 0 && (
                        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          <Star className="h-2.5 w-2.5 fill-[#FF6B00] text-[#FF6B00]" />
                          <span>{rating.toFixed(1)}</span>
                        </div>
                      )}

                      <button
                        type="button"
                        title="Убрать из понравившихся"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeLikedMovie(movie);
                        }}
                        className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-black/75 text-white/80 hover:bg-destructive hover:text-white transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="px-0.5">
                      <p className="truncate text-[11px] font-bold text-foreground group-hover:text-[#FF6B00] transition-colors">
                        {movie.title}
                      </p>
                      {movie.year && (
                        <span className="text-[10px] text-muted-foreground">{movie.year}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Сетка из двух карточек настроек */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Карточка смены Email */}
          <section className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 gap-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF6B00]/10 text-[#FF6B00]">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Изменить Email</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Обновите адрес электронной почты, привязанный к аккаунту.
                </p>
              </div>
            </div>

           {emailSuccess && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-xs text-green-500">
                {emailSuccess}
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted-foreground">Новый Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  disabled={isAuthLoading}
                  placeholder="new.email@example.com"
                  className="h-11 rounded-xl border border-border bg-background px-3.5 text-xs text-foreground outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted-foreground">Текущий пароль</label>
                <div className="relative">
                  <input
                    name="current_password"
                    type={showPass1 ? "text" : "password"}
                    disabled={isAuthLoading}
                    placeholder="Введите текущий пароль"
                    className="h-11 w-full rounded-xl border border-border bg-background px-3.5 pr-10 text-xs text-foreground outline-none focus:border-[#FF6B00]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass1(!showPass1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPass1 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="mt-1 h-11 w-fit rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] px-5 text-xs font-bold text-white shadow-md shadow-[#FF6B00]/20 transition-all cursor-pointer"
              >
                {isAuthLoading ? "Сохранение..." : "Сохранить изменения"}
              </button>
            </form>
          </section>

          {/* Карточка смены пароля */}
          <section className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 gap-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF6B00]/10 text-[#FF6B00]">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Изменить пароль</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Придумайте надёжный, уникальный пароль для защиты.
                </p>
              </div>
            </div>

            {passwordSuccess && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-xs text-green-500">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted-foreground">Текущий пароль</label>
                <input
                  name="old_password"
                  type="password"
                  required
                  disabled={isAuthLoading}
                  placeholder="Введите старый пароль"
                  className="h-11 rounded-xl border border-border bg-background px-3.5 text-xs text-foreground outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted-foreground">Новый пароль</label>
                <div className="relative">
                  <input
                    name="new_password"
                    type={showPass2 ? "text" : "password"}
                    required
                    minLength={6}
                    disabled={isAuthLoading}
                    placeholder="Минимум 6 символов"
                    className="h-11 w-full rounded-xl border border-border bg-background px-3.5 pr-10 text-xs text-foreground outline-none focus:border-[#FF6B00]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass2(!showPass2)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPass2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted-foreground">Повторите пароль</label>
                <div className="relative">
                  <input
                    name="confirm_password"
                    type={showPass3 ? "text" : "password"}
                    required
                    minLength={6}
                    disabled={isAuthLoading}
                    placeholder="Повторите новый пароль"
                    className="h-11 w-full rounded-xl border border-border bg-background px-3.5 pr-10 text-xs text-foreground outline-none focus:border-[#FF6B00]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass3(!showPass3)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPass3 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="mt-1 h-11 w-fit rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] px-5 text-xs font-bold text-white shadow-md shadow-[#FF6B00]/20 transition-all cursor-pointer"
              >
                {isAuthLoading ? "Обновление..." : "Сохранить изменения"}
              </button>
            </form>
          </section>
        </div>

        {/* Нижняя плашка безопасности */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#FF6B00]/20 bg-[#FF6B00]/5 px-6 py-4">
          <div className="flex items-center gap-3.5">
            <ShieldCheck className="h-5 w-5 text-[#FF6B00] shrink-0" />
            <div>
              <h3 className="text-xs font-bold">Ваш аккаунт защищён</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Мы используем современные стандарты шифрования для защиты ваших данных и предпочтений.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs font-bold text-muted-foreground hover:text-destructive transition-colors cursor-pointer self-end sm:self-auto"
          >
            Выйти из аккаунта
          </button>
        </section>
      </main>

      {/* Модальное окно деталей фильма */}
      <MovieDetailModal
        movie={selectedMovie}
        onClose={closeMovieDetails}
        onLike={(m) => rateMovie(m, 1)}
        onPass={(m) => removeLikedMovie(m)}
      />
    </div>
  );
}