import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Card, Input } from "@/components/common";

import Button from "@/components/ui/Button";

import { useAuth } from "@/contexts";

import { ROUTES } from "@/constants/routes";

import { loginSchema, type LoginFormData } from "@/features/auth/schemas/login.schema";

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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card
        title="Sign In"
        description="Enter your credentials to access your account."
        className="w-full max-w-md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
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
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {serverError}
            </div>
          )}

          <Button type="submit" className="w-full" loading={login.isPending}>
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}
