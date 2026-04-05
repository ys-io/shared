import { useRef, useState, useCallback } from "react";
import type { TextInput } from "react-native";
import { apiCall, validate } from "@ys-io/utils";
import { useAuthKit } from "./useAuthKitContext";
import { useFormErrors } from "./useFormErrors";
import { useAuthProvider } from "./useAuthProvider";
import { SPECIAL_CHAR_REGEX, PASSWORD_MIN_LENGTH, FOCUS_DELAY } from "../constans/defaults";
import type { AuthKitView, ForgotPasswordStep } from "../types/auth";
import * as yup from "yup";

export function useAuthKitFlow() {
  const { config, msg } = useAuthKit();
  const auth = useAuthProvider(config.supabase);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [view, setView] = useState<AuthKitView>("login");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fpStep, setFpStep] = useState<ForgotPasswordStep>("email");
  const [fpEmail, setFpEmail] = useState("");
  const [fpError, setFpError] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [rpPassword, setRpPassword] = useState("");
  const [rpConfirm, setRpConfirm] = useState("");
  const [rpLoading, setRpLoading] = useState(false);

  const { errors, setErrors, clearError, resetErrors } = useFormErrors();
  const rpErrors = useFormErrors();

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const passwordConfirmRef = useRef<TextInput>(null);
  const fpEmailRef = useRef<TextInput>(null);
  const rpPasswordRef = useRef<TextInput>(null);
  const rpConfirmRef = useRef<TextInput>(null);

  const rpcExists = config.rpcCheckEmailExists ?? "check_email_exists";
  const rpcRegistered = config.rpcCheckEmailRegistered ?? "check_email_registered";

  const signUpSchema = yup.object({
    name: yup.string().required(msg.vNameRequired).min(2, msg.vNameMin),
    email: yup.string().required(msg.vEmailRequired).email(msg.vEmailInvalid),
    password: yup.string().required(msg.vPasswordRequired)
      .min(PASSWORD_MIN_LENGTH, msg.vPasswordMin)
      .matches(/[A-Z]/, msg.vPasswordUppercase)
      .matches(SPECIAL_CHAR_REGEX, msg.vPasswordSpecial),
    passwordConfirm: yup.string().required(msg.vPasswordConfirmRequired)
      .oneOf([yup.ref("password")], msg.vPasswordConfirmMatch),
  });

  const resetPasswordSchema = yup.object({
    password: yup.string().required(msg.vPasswordRequired)
      .min(PASSWORD_MIN_LENGTH, msg.vPasswordMin)
      .matches(/[A-Z]/, msg.vPasswordUppercase)
      .matches(SPECIAL_CHAR_REGEX, msg.vPasswordSpecial),
    passwordConfirm: yup.string().required(msg.vPasswordConfirmRequired)
      .oneOf([yup.ref("password")], msg.vPasswordConfirmMatch),
  });

  const resetForm = useCallback(() => {
    resetErrors();
    setName("");
    setPassword("");
    setPasswordConfirm("");
    setAgreedTerms(false);
    setAgreedPrivacy(false);
  }, [resetErrors]);

  const handleSignup = useCallback(async () => {
    const { errors: ve } = await validate(signUpSchema, { name, email, password, passwordConfirm });
    if (!agreedTerms || !agreedPrivacy) ve.agree = msg.agreeRequired;
    if (Object.keys(ve).length > 0) {
      setErrors(ve);
      if (ve.name) nameRef.current?.focus();
      else if (ve.email) emailRef.current?.focus();
      else if (ve.password) passwordRef.current?.focus();
      else if (ve.passwordConfirm) passwordConfirmRef.current?.focus();
      return;
    }
    resetErrors();
    setLoading(true);
    try {
      const { data: exists } = await config.supabase.rpc(rpcRegistered, { target_email: email });
      if (exists) { setErrors({ email: msg.emailAlreadyRegistered }); emailRef.current?.focus(); setLoading(false); return; }
      const { error } = await apiCall(() => auth.signUpWithEmail(email, password, name));
      if (error) { setErrors({ email: error }); emailRef.current?.focus(); }
      else setView("signupOtp");
    } catch { setErrors({ email: msg.networkError }); }
    setLoading(false);
  }, [name, email, password, passwordConfirm, agreedTerms, agreedPrivacy, auth, config, msg, resetErrors, setErrors, rpcRegistered, signUpSchema]);

  const handleLogin = useCallback(async () => {
    if (!email) { setErrors({ email: msg.emailRequired }); emailRef.current?.focus(); return; }
    if (!password) { setErrors({ password: msg.passwordRequired }); passwordRef.current?.focus(); return; }
    resetErrors();
    setLoading(true);
    try {
      const { error } = await apiCall(() => auth.signInWithEmail(email, password));
      if (error) {
        const { data: exists } = await config.supabase.rpc(rpcExists, { target_email: email });
        if (!exists) { setErrors({ email: msg.accountNotFound }); emailRef.current?.focus(); }
        else { setErrors({ password: msg.passwordWrong }); passwordRef.current?.focus(); }
      }
    } catch { setErrors({ email: msg.networkError }); }
    setLoading(false);
  }, [email, password, auth, config, msg, resetErrors, setErrors, rpcExists]);

  const handleGoogleLogin = useCallback(async () => {
    resetErrors();
    setLoading(true);
    const { error } = await config.supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: typeof window !== "undefined" ? window.location.origin : undefined },
    });
    if (error) { setErrors({ email: error.message }); emailRef.current?.focus(); }
    setLoading(false);
  }, [config, resetErrors, setErrors]);

  const handleSubmit = view === "signup" ? handleSignup : handleLogin;

  // Forgot password
  const handleFpSubmit = useCallback(async () => {
    if (!fpEmail) { setFpError(msg.emailRequired); fpEmailRef.current?.focus(); return; }
    setFpError("");
    setFpLoading(true);
    try {
      const { data: exists } = await config.supabase.rpc(rpcExists, { target_email: fpEmail });
      if (!exists) { setFpError(msg.accountNotFound); fpEmailRef.current?.focus(); setFpLoading(false); return; }
      const { error } = await config.supabase.auth.resetPasswordForEmail(fpEmail);
      if (error) { setFpError(error.message); fpEmailRef.current?.focus(); }
      else { auth.pauseAuthListener(); setFpStep("otp"); }
    } catch { setFpError(msg.networkError); }
    setFpLoading(false);
  }, [fpEmail, config, auth, msg, rpcExists]);

  const handleFpOtpBack = useCallback(async () => {
    try { await auth.signOut(); } catch {}
    auth.resumeAuthListener();
    setFpStep("email");
  }, [auth]);

  const handleFpResetComplete = useCallback(async () => {
    try { await auth.signOut(); } catch {}
    auth.resumeAuthListener();
    setFpStep("done");
  }, [auth]);

  // Reset password
  const handleRpSubmit = useCallback(async () => {
    const { errors: ve } = await validate(resetPasswordSchema, { password: rpPassword, passwordConfirm: rpConfirm });
    if (Object.keys(ve).length > 0) {
      rpErrors.setErrors(ve);
      if (ve.password) rpPasswordRef.current?.focus();
      else if (ve.passwordConfirm) rpConfirmRef.current?.focus();
      return;
    }
    rpErrors.resetErrors();
    setRpLoading(true);
    const { error } = await config.supabase.auth.updateUser({ password: rpPassword });
    if (error) { rpErrors.setErrors({ password: error.message }); rpPasswordRef.current?.focus(); }
    else await handleFpResetComplete();
    setRpLoading(false);
  }, [rpPassword, rpConfirm, config, rpErrors, handleFpResetComplete, resetPasswordSchema]);

  const passwordRules = [
    { label: msg.pwRuleMin, test: (p: string) => p.length >= PASSWORD_MIN_LENGTH },
    { label: msg.pwRuleUppercase, test: (p: string) => /[A-Z]/.test(p) },
    { label: msg.pwRuleSpecial, test: (p: string) => SPECIAL_CHAR_REGEX.test(p) },
  ];

  return {
    auth,
    // login/signup
    name, setName, email, setEmail, password, setPassword,
    passwordConfirm, setPasswordConfirm,
    view, setView, agreedTerms, setAgreedTerms, agreedPrivacy, setAgreedPrivacy,
    loading, errors, clearError, resetForm, handleSubmit, handleGoogleLogin,
    nameRef, emailRef, passwordRef, passwordConfirmRef,
    // forgot password
    fpStep, setFpStep, fpEmail, setFpEmail, fpError, setFpError, fpLoading,
    fpEmailRef, handleFpSubmit, handleFpOtpBack, handleFpResetComplete,
    // reset password
    rpPassword, setRpPassword, rpConfirm, setRpConfirm, rpLoading,
    rpErrors: rpErrors.errors, rpClearError: rpErrors.clearError,
    rpPasswordRef, rpConfirmRef, handleRpSubmit,
    // utils
    passwordRules,
    msg,
  };
}
