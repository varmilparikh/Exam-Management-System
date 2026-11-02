import type { HTMLAttributes, ReactNode } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
      "inline-flex items-center rounded-full border border-transparent px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-700",

        success: "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-600/15",

        danger: "bg-rose-50 text-rose-800 ring-1 ring-inset ring-rose-600/15",

        warning: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/15",

        info: "bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-600/15",

        secondary: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/10",
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
