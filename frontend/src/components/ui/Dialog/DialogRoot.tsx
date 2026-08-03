import * as RadixDialog from "@radix-ui/react-dialog";

import type { DialogRootProps } from "./types";

export default function DialogRoot({
  open,
  onOpenChange,
  children,
}: DialogRootProps) {
  return (
    <RadixDialog.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      {children}
    </RadixDialog.Root>
  );
}