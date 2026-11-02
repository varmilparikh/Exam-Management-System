import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import type { InputProps } from "./types";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm shadow-slate-900/[0.02] transition-colors",
          "placeholder:text-slate-400",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:border-blue-500 focus-visible:ring-blue-500/20",
          "focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed",
          "disabled:bg-slate-50 disabled:opacity-70",
          error
            ? "border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
            : "border-slate-200 hover:border-slate-300",
          className
        )}
        aria-invalid={error}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
