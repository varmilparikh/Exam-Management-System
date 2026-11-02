import * as RadixDialog from "@radix-ui/react-dialog";

import { X } from "lucide-react";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import type { DialogHeaderProps } from "./types";

export default function DialogHeader({
  title,
  description,
  showCloseButton = true,
  className,
}: DialogHeaderProps) {
  return (
    <div
      className={cn("flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5", className)}
    >
      <div className="space-y-1">
        <RadixDialog.Title className="text-lg font-semibold tracking-tight text-slate-900">
          {title}
        </RadixDialog.Title>

        {description && (
          <RadixDialog.Description className="text-sm leading-5 text-slate-500">
            {description}
          </RadixDialog.Description>
        )}
      </div>

      {showCloseButton && (
        <RadixDialog.Close asChild>
          <Button variant="secondary" size="sm" aria-label="Close dialog">
            <X className="h-4 w-4" />
          </Button>
        </RadixDialog.Close>
      )}
    </div>
  );
}
