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
        "rounded-xl border border-gray-200 bg-white shadow-sm",
        className,
      )}
      {...props}
    >
      {(title || description) && (
        <div className="border-b border-gray-200 p-6">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          )}

          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}

      <div className="p-6">{children}</div>

      {footer && <div className="border-t border-gray-200 p-6">{footer}</div>}
    </div>
  );
}
