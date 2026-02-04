import { useMemo } from "react";
import { validatePassword } from "@/lib/validator/ValidatePassword";

export const usePasswordValidation = (password: string) => {
  return useMemo(() => {
    const rules = validatePassword(password);
    const isValid = Object.values(rules).every(Boolean);
    return { rules, isValid };
  }, [password]);
};
