import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ShieldCheck, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { AuthFormErrorAlert } from "@/pages/auth/components/auth-form-error-alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProfileForm() {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);
  const authError = useAuthStore((s) => s.AuthError);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const updatePassword = useAuthStore((s) => s.updatePassword);
  const logout = useAuthStore((s) => s.logout);

  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const [showEmailPass, setShowEmailPass] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailSuccess(null);
    useAuthStore.getState().clearAuthError();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();

    if (!email || email === user?.email) return;

    try {
      await updateProfile({ email });
      setEmailSuccess("Письмо с подтверждением отправлено на новый адрес!");
      form.reset();
    } catch {
      // Ошибка отобразится через authError
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordSuccess(null);
    setLocalError(null);
    useAuthStore.getState().clearAuthError();

    const form = event.currentTarget;
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
    } catch {
      // Ошибка отобразится через authError
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground p-6 md:p-10 transition-colors">
      {/* ВЕРХНЯЯ ПАНЕЛЬ НАВИГАЦИИ */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#FF6B00] text-[#FF6B00] font-black text-xs">
            ••
          </div>
          <span className="text-lg font-black tracking-wider">
            MOVIE<span className="text-[#FF6B00]">PICK</span>
          </span>
        </div>

        <Link
          to="/films"
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Назад к фильмам</span>
        </Link>
      </div>

      {/* ОСНОВНОЙ КОНТЕЙНЕР ПРОФИЛЯ */}
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-[#FF6B00] uppercase">
            Настройки аккаунта
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-0.5">
            Ваш профиль
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Управление личными данными и безопасностью аккаунта
          </p>
        </div>

        <AuthFormErrorAlert message={localError || authError} />

        {/* КАРТОЧКА ПОЛЬЗОВАТЕЛЯ */}
        <div className="flex items-center gap-5 rounded-2xl bg-card border border-border p-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#FF6B00] bg-[#FF6B00]/10 text-xl font-bold text-foreground">
            {initials}
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold leading-tight">
              {user?.name || "Пользователь MOVIEPICK"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {user?.email}
            </p>
          </div>
        </div>

        {/* СЕТКА ИЗ ДВУХ КАРТОЧЕК */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* КАРТОЧКА 1: ИЗМЕНИТЬ EMAIL */}
          <div className="flex flex-col justify-between rounded-2xl bg-card border border-border p-6 gap-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF6B00]/15 text-[#FF6B00]">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Изменить Email</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Обновите адрес электронной почты, привязанный к аккаунту
                </p>
              </div>
            </div>

            {emailSuccess && (
              <div className="p-3 text-xs rounded-xl bg-green-500/10 text-green-500 border border-green-500/20">
                {emailSuccess}
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="new-email" className="text-xs font-medium text-muted-foreground">
                  Новый Email
                </label>
                <Input
                  id="new-email"
                  name="email"
                  type="email"
                  placeholder="new.email@example.com"
                  required
                  disabled={isAuthLoading}
                  className="bg-background border-border"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email-confirm-pass" className="text-xs font-medium text-muted-foreground">
                  Текущий пароль
                </label>
                <div className="relative">
                  <Input
                    id="email-confirm-pass"
                    name="current_password"
                    type={showEmailPass ? "text" : "password"}
                    placeholder="Введите текущий пароль"
                    disabled={isAuthLoading}
                    className="bg-background border-border pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmailPass(!showEmailPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showEmailPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isAuthLoading}
                className="w-fit mt-1 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold px-5"
              >
                {isAuthLoading ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </form>
          </div>

          {/* КАРТОЧКА 2: ИЗМЕНИТЬ ПАРОЛЬ */}
          <div className="flex flex-col justify-between rounded-2xl bg-card border border-border p-6 gap-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF6B00]/15 text-[#FF6B00]">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Изменить пароль</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Придумайте надёжный, уникальный пароль для защиты
                </p>
              </div>
            </div>

            {passwordSuccess && (
              <div className="p-3 text-xs rounded-xl bg-green-500/10 text-green-500 border border-green-500/20">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="old-password" className="text-xs font-medium text-muted-foreground">
                  Текущий пароль
                </label>
                <div className="relative">
                  <Input
                    id="old-password"
                    name="old_password"
                    type={showOldPass ? "text" : "password"}
                    placeholder="Введите старый пароль"
                    required
                    disabled={isAuthLoading}
                    className="bg-background border-border pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showOldPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="new-password" className="text-xs font-medium text-muted-foreground">
                  Новый пароль
                </label>
                <div className="relative">
                  <Input
                    id="new-password"
                    name="new_password"
                    type={showNewPass ? "text" : "password"}
                    placeholder="Минимум 6 символов"
                    required
                    minLength={6}
                    disabled={isAuthLoading}
                    className="bg-background border-border pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirm-password" className="text-xs font-medium text-muted-foreground">
                  Повторите новый пароль
                </label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    name="confirm_password"
                    type={showConfirmPass ? "text" : "password"}
                    placeholder="Повторите новый пароль"
                    required
                    minLength={6}
                    disabled={isAuthLoading}
                    className="bg-background border-border pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showConfirmPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isAuthLoading}
                className="w-fit mt-1 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold px-5"
              >
                {isAuthLoading ? "Обновление..." : "Сохранить изменения"}
              </Button>
            </form>
          </div>
        </div>

        {/* НИЖНЯЯ ПЛАШКА ЗАЩИТЫ И КНОПКА ВЫХОДА */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-card border border-border px-6 py-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B00]/15 text-[#FF6B00]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold">Ваш аккаунт защищён</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Мы рекомендуем периодически обновлять пароль для защиты вашего профиля
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors cursor-pointer bg-transparent border-0 self-end sm:self-auto"
          >
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}