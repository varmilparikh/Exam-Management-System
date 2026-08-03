import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import type { SelectProps } from "./types";

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { options, placeholder = "Select an option", className, error, ...props },
    ref,
  ) => {
    return (
      <div className="space-y-1">
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
            "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-200",
            className,
          )}
          {...props}
        >
          <option value="">{placeholder}</option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
