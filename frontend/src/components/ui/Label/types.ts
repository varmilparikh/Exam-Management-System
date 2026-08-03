import type { ComponentPropsWithoutRef } from "react";

export interface LabelProps
  extends ComponentPropsWithoutRef<"label"> {
  required?: boolean;
}