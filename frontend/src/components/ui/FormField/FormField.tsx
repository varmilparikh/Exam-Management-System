import Label from "@/components/ui/Label";

import type { FormFieldProps } from "./types";

export default function FormField({
  label,
  htmlFor,
  required = false,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={htmlFor}
        required={required}
      >
        {label}
      </Label>

      {children}

      {error && (
        <p
          className="text-sm text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}