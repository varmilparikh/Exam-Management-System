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
    "rounded-lg",
    "font-medium",
    "transition-colors duration-200",
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
          "bg-blue-600 text-white hover:bg-blue-700",

        secondary:
          "bg-gray-200 text-gray-900 hover:bg-gray-300",

        success:
          "bg-green-600 text-white hover:bg-green-700",

        danger:
          "bg-red-600 text-white hover:bg-red-700",

        outline:
          "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100",
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
