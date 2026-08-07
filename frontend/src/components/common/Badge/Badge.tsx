import type { HTMLAttributes, ReactNode } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-800",

        success: "bg-green-100 text-green-800",

        danger: "bg-red-100 text-red-800",

        warning: "bg-yellow-100 text-yellow-800",

        info: "bg-blue-100 text-blue-800",

        secondary: "bg-gray-200 text-gray-700",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  },
);

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  children: ReactNode;
}

export default function Badge({
  children,
  variant,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        badgeVariants({
          variant,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
