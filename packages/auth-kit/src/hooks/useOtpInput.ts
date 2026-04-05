import { useState, useRef, useCallback } from "react";
import type { TextInput } from "react-native";
import { OTP_LENGTH, FOCUS_DELAY } from "../constans/defaults";

export function useOtpInput(onComplete: (code: string) => void) {
  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef<(TextInput | null)[]>(Array(OTP_LENGTH).fill(null));

  const resetCode = useCallback(() => {
    setCode(Array(OTP_LENGTH).fill(""));
    setTimeout(() => inputRefs.current[0]?.focus(), FOCUS_DELAY);
  }, []);

  const handleChange = useCallback(
    (value: string, index: number) => {
      if (!/^\d*$/.test(value)) return;

      const newCode = [...code];

      if (value.length > 1) {
        const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
        digits.forEach((d, i) => {
          if (i < OTP_LENGTH) newCode[i] = d;
        });
        setCode(newCode);
        const nextIndex = Math.min(digits.length, OTP_LENGTH - 1);
        inputRefs.current[nextIndex]?.focus();

        if (digits.length === OTP_LENGTH) {
          onComplete(newCode.join(""));
        }
        return;
      }

      newCode[index] = value;
      setCode(newCode);
      setError("");

      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (newCode.every((d) => d) && newCode.join("").length === OTP_LENGTH) {
        onComplete(newCode.join(""));
      }
    },
    [code, onComplete],
  );

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key === "Backspace" && !code[index] && index > 0) {
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
    },
    [code],
  );

  return {
    code,
    error,
    setError,
    inputRefs,
    resetCode,
    handleChange,
    handleKeyPress,
  };
}
