"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  clearStudentSession,
  forgotStudentPassword,
  loginStudent,
  registerStudent,
  resetStudentPassword,
  setStudentSession,
  verifyStudentOtp,
} from "@/lib/student-api";
import { useTranslations } from "next-intl";

type AuthStep = "login" | "register" | "forgot" | "verify-otp" | "reset-password";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("common");
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
      setError(err instanceof Error ? err.message : t("auth.login_failed"));
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
      setNotice(t("auth.otp_sent"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.otp_request_failed"));
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
      setError(err instanceof Error ? err.message : t("auth.register_failed"));
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
      setNotice(t("auth.otp_verified", { minutes: data.expires_in_minutes }));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.otp_failed"));
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
      setNotice(t("auth.password_reset_success"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.reset_failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">
            {t("auth.student_access")}
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            {step === "register"
              ? t("auth.register_subtitle")
              : t("auth.login_subtitle")}
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("auth.email")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("auth.password")}
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl"
              >
                {loading ? t("actions.signing_in") : t("actions.sign_in")}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setStep("forgot");
                  setError(null);
                  setNotice(null);
                }}
                className="w-full text-sm text-primary font-medium hover:underline"
              >
                {t("auth.forgot_password")}
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
                {t("auth.create_new_account")}
              </button>
            </form>
          ) : null}

          {step === "register" ? (
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("auth.full_name")}
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={registerName}
                  onChange={(event) => setRegisterName(event.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("auth.email")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("auth.phone_optional")}
                </label>
                <input
                  type="tel"
                  value={registerPhone}
                  onChange={(event) => setRegisterPhone(event.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("auth.password")}
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={registerPassword}
                  onChange={(event) => setRegisterPassword(event.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl"
              >
                {loading ? t("actions.creating_account") : t("actions.create_account")}
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
                {t("auth.back_to_login")}
              </button>
            </form>
          ) : null}

          {step === "forgot" ? (
            <form className="space-y-4" onSubmit={handleForgotPassword}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("auth.account_email")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl"
              >
                {loading ? t("actions.sending_otp") : t("actions.send_otp")}
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
                {t("auth.back_to_login")}
              </button>
            </form>
          ) : null}

          {step === "verify-otp" ? (
            <form className="space-y-4" onSubmit={handleVerifyOtp}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("auth.email")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("auth.otp_code")}
                </label>
                <input
                  type="text"
                  required
                  pattern="\\d{6}"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl"
              >
                {loading ? t("actions.verifying") : t("actions.verify_otp")}
              </Button>
            </form>
          ) : null}

          {step === "reset-password" ? (
            <form className="space-y-4" onSubmit={handleResetPassword}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("auth.new_password")}
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl"
              >
                {loading ? t("actions.resetting") : t("actions.reset_password")}
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
                {t("auth.back_to_login")}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}
