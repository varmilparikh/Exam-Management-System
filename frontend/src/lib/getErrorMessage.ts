import axios from "axios";

export function getErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "Something went wrong.";
  }

  const data = error.response?.data as {
    message?: string;
    errors?: {
      formErrors?: string[];
      fieldErrors?: Record<string, string[]>;
    };
  };

  if (data?.errors?.formErrors?.length) {
    return data.errors.formErrors[0];
  }

  if (data?.errors?.fieldErrors) {
    const firstField = Object.values(data.errors.fieldErrors)[0];

    if (Array.isArray(firstField) && firstField.length > 0) {
      return firstField[0];
    }
  }

  return data?.message ?? "Something went wrong.";
}
