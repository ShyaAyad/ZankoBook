import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { GraduationCap, Mail, Lock, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import type { LoginPayload } from "@/types/auth";
import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.token);
      navigate("/", { replace: true });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const payload = {
      email,
      password,
    };

    mutate(payload);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-white lg:flex-row">
      {/* Left hero panel */}
      <div className="relative hidden overflow-hidden bg-linear-to-br from-teal-500 via-teal-700 to-teal-900 p-12 text-white lg:flex lg:w-1/2 lg:flex-col lg:justify-between">
        {/* decorative glow accents */}
        <div className="pointer-events-none absolute -inset-e-24 -top-24 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -inset-s-24 bottom-0 h-96 w-96 translate-y-1/3 rounded-full bg-teal-950/50 blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
            <GraduationCap className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xl font-bold leading-tight">{t("ZankoBook")}</p>
            <p className="text-sm text-teal-100">{t("Department Learning")}</p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
            {t("Teach, learn and submit")}{" "}
            <span className="text-teal-200">—</span>
            <br />
            {t("all in one place.")}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-teal-50/90">
            {t(
              "The student-and-lecturer companion to e-Zanko. Materials, assignments, attendance, marks and requests.",
            )}
          </p>
        </div>

        {/* Footer */}
        <div className="relative flex items-center gap-2 text-sm text-teal-100/80">
          <Landmark className="h-4 w-4" />
          <span>
            {t("Ministry of Higher Education")} · {t("Kurdistan Region")}
          </span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full items-center justify-center px-6 py-12 sm:px-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Compact logo, shown only when the hero panel is hidden (mobile) */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100">
              <GraduationCap
                className="h-5 w-5 text-teal-700"
                strokeWidth={2}
              />
            </div>
            <p className="text-lg font-bold text-slate-900">{t("ZankoBook")}</p>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {t("Welcome back")}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {t("Sign in to your department")}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                {t("Email")}
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute inset-s-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@univ.edu"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 ps-10 pe-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                {t("Password")}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute inset-s-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 ps-10 pe-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <Button
              type="submit"
              className={`h-12 w-full rounded-xl bg-teal-200 text-base font-bold text-teal-700 shadow-sm transition-colors hover:bg-teal-200 hover:text-teal-500 ${isPending ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              {isPending ? t("Signing in...") : t("Sign in")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
