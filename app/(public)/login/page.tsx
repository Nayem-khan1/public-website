"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StarBackground } from "@/components/StarBackground";
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
  "w-full h-12 rounded-xl glass-effect-dark px-4 text-sm outline-none text-white overflow-hidden placeholder:text-white/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300";

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
    <div className="relative min-h-screen w-full flex items-center justify-center z-10 py-24 sm:py-32">
      {/* Background layer container for fixed positioning (covers entire screen on large monitors) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505] w-full h-full">
        <StarBackground />
        
        {/* Ambient Dark Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(241,2,76,0.1)_0%,transparent_100%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-[radial-gradient(circle,rgba(81,74,137,0.2)_0%,transparent_60%)] blur-[120px]" 
          />
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 w-full flex justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md rounded-[24px] glass-effect-dark border border-white/10 bg-black/40 backdrop-blur-xl p-6 sm:p-10 shadow-[0_0_80px_-20px_rgba(241,2,76,0.3)] relative overflow-hidden"
        >
          {/* Edge highlights */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-30 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />

          <div className="relative z-10">
            <h1 className="mb-2 text-3xl md:text-4xl font-display font-bold text-white tracking-tight text-center sm:text-left">
              {t("login.title")}
            </h1>
            <p className="mb-8 text-sm text-white/70 font-medium text-center sm:text-left">
              {step === "register"
                ? t("login.registerSubtitle")
                : t("login.loginSubtitle")}
            </p>

            {notice ? (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/20 p-4 text-sm font-medium text-emerald-200 shadow-inner"
              >
                {notice}
              </motion.div>
            ) : null}

            {error ? (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl border border-primary/40 bg-primary/20 p-4 text-sm font-medium text-white shadow-[0_0_15px_rgba(241,2,76,0.15)]"
              >
                {error}
              </motion.div>
            ) : null}

            {step === "login" ? (
              <form className="space-y-5" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <label className="ml-1 block text-sm font-semibold tracking-wide text-white/90">
                    {t("login.email")}
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className={inputClassName}
                      placeholder="student@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="ml-1 block text-sm font-semibold tracking-wide text-white/90">
                    {t("login.password")}
                  </label>
                  <div className="relative group">
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className={inputClassName}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div className="pt-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-primary text-white hover:bg-primary/90 text-base font-bold shadow-[0_0_20px_rgba(241,2,76,0.3)] hover:shadow-[0_0_40px_rgba(241,2,76,0.5)] transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? t("login.signingIn") : t("login.signIn")}
                  </Button>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-center text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("forgot");
                      setError(null);
                      setNotice(null);
                    }}
                    className="font-semibold text-white/80 hover:text-white transition-colors border-b border-transparent hover:border-white/50"
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
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    {t("login.createNewAccount")}
                  </button>
                </div>
              </form>
            ) : null}

            {step === "register" ? (
              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="space-y-1.5">
                  <label className="ml-1 block text-sm font-semibold tracking-wide text-white/90">
                    {t("login.fullName")}
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={registerName}
                    onChange={(event) => setRegisterName(event.target.value)}
                    className={inputClassName}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="ml-1 block text-sm font-semibold tracking-wide text-white/90">
                    {t("login.email")}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={inputClassName}
                    placeholder="student@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="ml-1 block text-sm font-semibold tracking-wide text-white/90">
                    {t("login.phoneOptional")}
                  </label>
                  <input
                    type="tel"
                    value={registerPhone}
                    onChange={(event) => setRegisterPhone(event.target.value)}
                    className={inputClassName}
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="ml-1 block text-sm font-semibold tracking-wide text-white/90">
                    {t("login.password")}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={registerPassword}
                    onChange={(event) => setRegisterPassword(event.target.value)}
                    className={inputClassName}
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-primary text-white hover:bg-primary/90 text-base font-bold shadow-[0_0_20px_rgba(241,2,76,0.3)] hover:shadow-[0_0_40px_rgba(241,2,76,0.5)] transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? t("login.creatingAccount") : t("login.createAccount")}
                  </Button>
                </div>
                
                <div className="text-center pt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("login");
                      setError(null);
                      setNotice(null);
                    }}
                    className="text-sm font-semibold text-white/70 hover:text-white transition-colors border-b border-transparent hover:border-white/50"
                  >
                    {t("login.backToLogin")}
                  </button>
                </div>
              </form>
            ) : null}

            {step === "forgot" ? (
              <form className="space-y-5" onSubmit={handleForgotPassword}>
                <div className="space-y-2">
                  <label className="ml-1 block text-sm font-semibold tracking-wide text-white/90">
                    {t("login.accountEmail")}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={inputClassName}
                    placeholder="student@example.com"
                  />
                </div>
                
                <div className="pt-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-primary text-white hover:bg-primary/90 text-base font-bold shadow-[0_0_20px_rgba(241,2,76,0.3)] hover:shadow-[0_0_40px_rgba(241,2,76,0.5)] transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? t("login.sendingOtp") : t("login.sendOtp")}
                  </Button>
                </div>
                
                <div className="text-center pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("login");
                      setError(null);
                      setNotice(null);
                    }}
                    className="text-sm font-semibold text-white/70 hover:text-white transition-colors border-b border-transparent hover:border-white/50"
                  >
                    {t("login.backToLogin")}
                  </button>
                </div>
              </form>
            ) : null}

            {step === "verify-otp" ? (
              <form className="space-y-5" onSubmit={handleVerifyOtp}>
                <div className="space-y-2">
                  <label className="ml-1 block text-sm font-semibold tracking-wide text-white/90">
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
                <div className="space-y-2">
                  <label className="ml-1 block text-sm font-semibold tracking-wide text-white/90">
                    {t("login.otpCode")}
                  </label>
                  <input
                    type="text"
                    required
                    pattern="\d{6}"
                    maxLength={6}
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    className={`${inputClassName} tracking-[0.25em] text-center text-lg font-bold placeholder:tracking-normal`}
                    placeholder="------"
                  />
                </div>
                
                <div className="pt-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-primary text-white hover:bg-primary/90 text-base font-bold shadow-[0_0_20px_rgba(241,2,76,0.3)] transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? t("login.verifying") : t("login.verifyOtp")}
                  </Button>
                </div>
              </form>
            ) : null}

            {step === "reset-password" ? (
              <form className="space-y-5" onSubmit={handleResetPassword}>
                <div className="space-y-2">
                  <label className="ml-1 block text-sm font-semibold tracking-wide text-white/90">
                    {t("login.newPassword")}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className={inputClassName}
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="pt-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-primary text-white hover:bg-primary/90 text-base font-bold shadow-[0_0_20px_rgba(241,2,76,0.3)] transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? t("login.resettingPassword") : t("login.resetPassword")}
                  </Button>
                </div>
                
                <div className="text-center pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("login");
                      setError(null);
                      setNotice(null);
                    }}
                    className="text-sm font-semibold text-white/70 hover:text-white transition-colors border-b border-transparent hover:border-white/50"
                  >
                    {t("login.backToLogin")}
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
