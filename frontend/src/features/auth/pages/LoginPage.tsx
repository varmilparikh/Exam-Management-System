import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Input } from "@/components/common";

import Button from "@/components/ui/Button";

import { useAuth } from "@/contexts";

import { ROUTES } from "@/constants/routes";

import { loginSchema, type LoginFormData } from "@/features/auth/schemas/login.schema";
import { CalendarDays, Check, ClipboardCheck, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormData) => {
    setServerError("");

    try {
      await login.mutateAsync(values);

      navigate(ROUTES.HOME);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(error.response?.data?.message ?? "Login failed.");
      } else {
        setServerError("Something went wrong.");
      }
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#edf2f8] px-4 py-6 sm:px-8 sm:py-10">
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-blue-200/35 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-teal-200/25 blur-3xl" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.14)] md:min-h-[640px] md:grid-cols-[1.05fr_0.95fr]">
        <section className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#122238] via-[#172e49] to-[#1d4770] px-7 py-8 text-white sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full border border-white/[0.08]" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 top-32 h-48 w-48 rounded-full border border-white/[0.08]" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 bg-[radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.18),transparent_70%)]" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-400 text-white shadow-lg shadow-slate-950/20">
                <ClipboardCheck className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-base font-semibold tracking-wide">Exam Duty</span>
                <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-blue-100/65">Management system</span>
              </span>
            </div>

            <div className="mt-10 max-w-lg sm:mt-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-200/20 bg-teal-200/10 px-3 py-1.5 text-xs font-medium text-teal-100">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                Examination operations, in sync
              </span>
              <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[42px]">
                A clearer view of every exam day.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-blue-100/75 sm:text-base sm:leading-7">
                Coordinate schedules, faculty duties, and requests from one organized workspace.
              </p>
            </div>

            <div className="relative mt-8 grid max-w-lg gap-3 sm:mt-10">
              {[
                { icon: CalendarDays, label: "Keep exam schedules easy to follow" },
                { icon: ClipboardCheck, label: "See duty assignments at a glance" },
                { icon: ShieldCheck, label: "Work with access tailored to your role" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.045] px-3.5 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-teal-200">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-blue-50/90">{label}</span>
                  <Check className="ml-auto h-4 w-4 shrink-0 text-teal-300/80" />
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 mt-8 text-xs leading-5 text-blue-100/55">
            Secure staff access · Your role determines what you can view and manage
          </p>
        </section>

        <section className="flex items-center justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-14">
          <div className="w-full max-w-md">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Staff sign in</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in with your work account to continue to your dashboard.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <Input
                label="Work email"
                type="email"
                placeholder="name@institution.edu"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register("password")}
              />

              {serverError && (
                <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-700">
                  {serverError}
                </div>
              )}

              <Button type="submit" size="lg" className="mt-2 w-full" loading={login.isPending}>
                Sign in to your account
              </Button>
            </form>

            <div className="mt-7 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              <p className="text-xs leading-5 text-slate-500">
                Account access is managed by your institution. If you need help signing in, contact your administrator.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
