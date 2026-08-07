import type { SelectHTMLAttributes, ReactNode } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly SelectOption[];

  placeholder?: string;

  error?: string;

  children?: ReactNode;
}
