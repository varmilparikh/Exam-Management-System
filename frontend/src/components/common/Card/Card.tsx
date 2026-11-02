import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;

  title?: string;

  description?: string;

  footer?: ReactNode;
}

export default function Card({
  children,
  title,
  description,
  footer,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.045)]",
        className,
      )}
      {...props}
    >
      {(title || description) && (
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5">
          {title && (
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
          )}

          {description && (
            <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
          )}
        </div>
      )}

      <div className="p-5 sm:p-6">{children}</div>

      {footer && <div className="border-t border-slate-100 p-5 sm:p-6">{footer}</div>}
    </div>
  );
}
