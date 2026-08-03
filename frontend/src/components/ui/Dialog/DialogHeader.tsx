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
      className={cn("flex items-start justify-between border-b p-6", className)}
    >
      <div className="space-y-1">
        <RadixDialog.Title className="text-lg font-semibold text-gray-900">
          {title}
        </RadixDialog.Title>

        {description && (
          <RadixDialog.Description className="text-sm text-gray-500">
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
