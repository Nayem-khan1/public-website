"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/contexts/LanguageContext";
import {
  clearStudentSession,
  forgotStudentPassword,
  loginStudent,
  registerStudent,
  resetStudentPassword,
  setStudentSession,
  verifyStudentOtp,
} from "@/lib/student-api";

type AuthStep = "login" | "register" | "forgot" | "verify-otp" | "reset-password";

const inputClassName =
  "w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useAppTranslation();
  const [redirectTo, setRedirectTo] = useState("/dashboard");

  const [step, setStep] = useState<AuthStep>("login");
  const [registerName, setRegisterName] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const nextPath = params.get("next");
    if (nextPath) {
      setRedirectTo(nextPath);
    }
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      clearStudentSession();
      const data = await loginStudent({ email, password });
      setStudentSession(data.token);
      router.replace(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.loginFailed"));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      await forgotStudentPassword(email);
      setStep("verify-otp");
      setNotice(t("login.otpSent"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.requestOtpFailed"));
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      clearStudentSession();
      const data = await registerStudent({
        name: registerName,
        email,
        password: registerPassword,
        phone: registerPhone.trim() || undefined,
      });
      setStudentSession(data.token);
      router.replace(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.registrationFailed"));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const data = await verifyStudentOtp({ email, otp });
      setResetToken(data.reset_token);
      setStep("reset-password");
      setNotice(t("login.otpVerified", { minutes: data.expires_in_minutes }));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.otpVerificationFailed"));
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      await resetStudentPassword({
        email,
        newPassword,
        resetToken,
      });
      setPassword("");
      setOtp("");
      setNewPassword("");
      setResetToken("");
      setStep("login");
      setNotice(t("login.passwordResetSuccessful"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.resetPasswordFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-slate-900">{t("login.title")}</h1>
          <p className="mb-6 text-sm text-slate-500">
            {step === "register"
              ? t("login.registerSubtitle")
              : t("login.loginSubtitle")}
          </p>

          {notice ? (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              {notice}
            </div>
          ) : null}

          {error ? (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {step === "login" ? (
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {t("login.email")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {t("login.password")}
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={inputClassName}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary text-white hover:bg-primary/90"
              >
                {loading ? t("login.signingIn") : t("login.signIn")}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setStep("forgot");
                  setError(null);
                  setNotice(null);
                }}
                className="w-full text-sm font-medium text-primary hover:underline"
              >
                {t("login.forgotPassword")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("register");
                  setError(null);
                  setNotice(null);
                }}
                className="w-full text-sm text-slate-500 hover:text-slate-700"
              >
                {t("login.createNewAccount")}
              </button>
            </form>
          ) : null}

          {step === "register" ? (
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {t("login.fullName")}
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={registerName}
                  onChange={(event) => setRegisterName(event.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {t("login.email")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {t("login.phoneOptional")}
                </label>
                <input
                  type="tel"
                  value={registerPhone}
                  onChange={(event) => setRegisterPhone(event.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {t("login.password")}
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={registerPassword}
                  onChange={(event) => setRegisterPassword(event.target.value)}
                  className={inputClassName}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary text-white hover:bg-primary/90"
              >
                {loading ? t("login.creatingAccount") : t("login.createAccount")}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setStep("login");
                  setError(null);
                  setNotice(null);
                }}
                className="w-full text-sm text-slate-500 hover:text-slate-700"
              >
                {t("login.backToLogin")}
              </button>
            </form>
          ) : null}

          {step === "forgot" ? (
            <form className="space-y-4" onSubmit={handleForgotPassword}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {t("login.accountEmail")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClassName}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary text-white hover:bg-primary/90"
              >
                {loading ? t("login.sendingOtp") : t("login.sendOtp")}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setStep("login");
                  setError(null);
                  setNotice(null);
                }}
                className="w-full text-sm text-slate-500 hover:text-slate-700"
              >
                {t("login.backToLogin")}
              </button>
            </form>
          ) : null}

          {step === "verify-otp" ? (
            <form className="space-y-4" onSubmit={handleVerifyOtp}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {t("login.email")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {t("login.otpCode")}
                </label>
                <input
                  type="text"
                  required
                  pattern="\\d{6}"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  className={inputClassName}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary text-white hover:bg-primary/90"
              >
                {loading ? t("login.verifying") : t("login.verifyOtp")}
              </Button>
            </form>
          ) : null}

          {step === "reset-password" ? (
            <form className="space-y-4" onSubmit={handleResetPassword}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {t("login.newPassword")}
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className={inputClassName}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary text-white hover:bg-primary/90"
              >
                {loading ? t("login.resettingPassword") : t("login.resetPassword")}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setStep("login");
                  setError(null);
                  setNotice(null);
                }}
                className="w-full text-sm text-slate-500 hover:text-slate-700"
              >
                {t("login.backToLogin")}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}
