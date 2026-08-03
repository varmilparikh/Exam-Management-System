import * as RadixLabel from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

import type { LabelProps } from "./types";

export default function Label({
  children,
  className,
  required = false,
  ...props
}: LabelProps) {
  return (
    <RadixLabel.Root
      className={cn(
        "text-sm font-medium leading-none text-gray-900",
        "peer-disabled:cursor-not-allowed",
        "peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}

      {required && (
        <span
          className="ml-1 text-red-500"
          aria-hidden="true"
        >
          *
        </span>
      )}
    </RadixLabel.Root>
  );
}