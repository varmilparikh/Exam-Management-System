import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

import { cva, type VariantProps } from "class-variance-authority";

import Spinner from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-xl",
    "font-semibold",
    "transition-all duration-150",
    "active:translate-y-px",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-blue-500",
    "focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-blue-700 text-white shadow-sm shadow-blue-900/15 hover:bg-blue-800 hover:shadow-md",

        secondary:
          "border border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300 hover:bg-slate-200",

        success:
          "bg-emerald-700 text-white shadow-sm shadow-emerald-900/10 hover:bg-emerald-800",

        danger:
          "bg-rose-600 text-white shadow-sm shadow-rose-900/10 hover:bg-rose-700",

        outline:
          "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50",
      },

      size: {
        sm: "h-9 px-3 text-sm",

        md: "h-10 px-4 text-sm",

        lg: "h-11 px-6 text-base",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  loading?: boolean;
}

const spinnerSizeMap = {
  sm: "sm",
  md: "sm",
  lg: "md",
} as const;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = "button",
      children,
      loading = false,
      disabled,
      className,
      variant,
      size,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          buttonVariants({
            variant,
            size,
          }),
          className
        )}
        {...props}
      >
        {loading && (
          <Spinner
            size={spinnerSizeMap[size ?? "md"]}
          />
        )}

        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export type { ButtonProps };
export default Button;
