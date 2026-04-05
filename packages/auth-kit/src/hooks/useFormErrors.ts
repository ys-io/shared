import { useState, useCallback } from "react";

export function useFormErrors() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const resetErrors = useCallback(() => {
    setErrors({});
  }, []);

  return { errors, setErrors, clearError, resetErrors };
}
