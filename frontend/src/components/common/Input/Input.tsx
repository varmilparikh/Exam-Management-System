import { forwardRef, useId, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;

  error?: string;

  helperText?: string;

  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, required = false, className, id, ...props },
    ref,
  ) => {
    const generatedId = useId();

    const inputId = id ?? generatedId;

    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-slate-700"
          >
            {label}

            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-900/[0.02] transition-colors",
            "placeholder:text-slate-400",
            "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          {...props}
        />

        {error ? (
          <p id={`${inputId}-error`} className="text-sm text-rose-600">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-sm text-slate-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
