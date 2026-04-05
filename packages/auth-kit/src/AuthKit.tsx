import { type ReactNode } from "react";
import { View, TextInput as RNTextInput, Platform, StyleSheet } from "react-native";
import { Button, TextInput, Text, Screen, Body, Divider, LoadingScreen, useTheme } from "@ys-io/ui";
import type { AuthKitConfig, AuthKitMessages } from "./types/config";
import { AuthKitProvider, useAuthKit } from "./hooks/useAuthKitContext";
import { useAuthKitFlow } from "./hooks/useAuthKitFlow";
import { useOtpTimer } from "./hooks/useOtpTimer";
import { useOtpInput } from "./hooks/useOtpInput";
import { FOCUS_DELAY } from "./constans/defaults";

interface AuthKitProps {
  config: AuthKitConfig;
  messages?: AuthKitMessages;
  children: ReactNode;
}

export function AuthKit({ config, messages, children }: AuthKitProps) {
  return (
    <AuthKitProvider config={config} messages={messages}>
      <AuthKitInner>{children}</AuthKitInner>
    </AuthKitProvider>
  );
}

function AuthKitInner({ children }: { children: ReactNode }) {
  const flow = useAuthKitFlow();
  const { config, msg } = useAuthKit();

  if (flow.auth.isLoading) return <LoadingScreen />;
  if (flow.auth.isAuthenticated) return <>{children}</>;

  if (flow.view === "terms" && config.terms) {
    return (
      <Screen scroll>
        <Body>{config.terms.content}<Button title={msg.back} onPress={() => flow.setView("signup")} variant="secondary" style={s.mt24} /></Body>
      </Screen>
    );
  }
  if (flow.view === "privacy" && config.privacy) {
    return (
      <Screen scroll>
        <Body>{config.privacy.content}<Button title={msg.back} onPress={() => flow.setView("signup")} variant="secondary" style={s.mt24} /></Body>
      </Screen>
    );
  }
  if (flow.view === "signupOtp") {
    return <OtpView email={flow.email} type="signup" onVerified={() => {}} onBack={() => flow.setView("signup")} />;
  }
  if (flow.view === "forgotPassword") {
    if (flow.fpStep === "otp") {
      return <OtpView email={flow.fpEmail} type="recovery" onVerified={() => flow.setFpStep("reset")} onBack={flow.handleFpOtpBack} />;
    }
    if (flow.fpStep === "reset") {
      return <ResetPasswordView flow={flow} />;
    }
    if (flow.fpStep === "done") {
      return (
        <Screen>
          <Body centered>
            <Text variant="title" align="center" style={s.mb16}>{msg.passwordChangedTitle}</Text>
            <Text variant="subtitle" align="center" style={s.mb40}>{msg.passwordChangedSubtitle}</Text>
            <Button title={msg.backToLogin} onPress={() => { flow.setView("login"); flow.setFpStep("email"); }} variant="primary" />
          </Body>
        </Screen>
      );
    }
    return <ForgotPasswordView flow={flow} />;
  }

  return (
    <Screen scroll>
      <Body centered>
        <Text variant="title" align="center" style={s.titleMargin}>
          {config.appIcon ? `${config.appIcon} ` : ""}{config.appName}
        </Text>
        {config.appSubtitle && (
          <Text variant="subtitle" align="center" style={s.mb40}>{config.appSubtitle}</Text>
        )}

        {flow.view === "signup" && (
          <>
            <TextInput ref={flow.nameRef} label={msg.labelName} placeholder={msg.placeholderName} value={flow.name} onChangeText={(v) => { flow.setName(v); flow.clearError("name"); }} onSubmitEditing={flow.handleSubmit} error={flow.errors.name} containerStyle={s.mb16} />
            <TextInput ref={flow.emailRef} label={msg.labelEmail} placeholder={msg.placeholderEmail} value={flow.email} onChangeText={(v) => { flow.setEmail(v); flow.clearError("email"); }} autoCapitalize="none" keyboardType="email-address" onSubmitEditing={flow.handleSubmit} error={flow.errors.email} containerStyle={s.mb16} />
            <TextInput ref={flow.passwordRef} label={msg.labelPassword} placeholder={msg.placeholderPasswordSignup} value={flow.password} onChangeText={(v) => { flow.setPassword(v); flow.clearError("password"); }} secureTextEntry onSubmitEditing={flow.handleSubmit} error={flow.errors.password} containerStyle={s.mb4} />
            <PasswordStrengthView password={flow.password} rules={flow.passwordRules} />
            <TextInput ref={flow.passwordConfirmRef} label={msg.labelPasswordConfirm} placeholder={msg.placeholderPasswordConfirm} value={flow.passwordConfirm} onChangeText={(v) => { flow.setPasswordConfirm(v); flow.clearError("passwordConfirm"); }} secureTextEntry onSubmitEditing={flow.handleSubmit} error={flow.errors.passwordConfirm} containerStyle={s.mb16} />
            {(config.terms || config.privacy) && (
              <TermsView
                agreedTerms={flow.agreedTerms} agreedPrivacy={flow.agreedPrivacy}
                onToggleAll={() => { const n = !(flow.agreedTerms && flow.agreedPrivacy); flow.setAgreedTerms(n); flow.setAgreedPrivacy(n); flow.clearError("agree"); }}
                onToggleTerms={() => { flow.setAgreedTerms(!flow.agreedTerms); flow.clearError("agree"); }}
                onTogglePrivacy={() => { flow.setAgreedPrivacy(!flow.agreedPrivacy); flow.clearError("agree"); }}
                onViewTerms={config.terms ? () => flow.setView("terms") : undefined}
                onViewPrivacy={config.privacy ? () => flow.setView("privacy") : undefined}
                error={flow.errors.agree}
              />
            )}
          </>
        )}

        {flow.view === "login" && (
          <>
            <TextInput ref={flow.emailRef} label={msg.labelEmail} placeholder={msg.placeholderEmail} value={flow.email} onChangeText={(v) => { flow.setEmail(v); flow.clearError("email"); }} autoCapitalize="none" keyboardType="email-address" onSubmitEditing={flow.handleSubmit} error={flow.errors.email} containerStyle={s.mb16} />
            <TextInput ref={flow.passwordRef} label={msg.labelPassword} placeholder={msg.placeholderPassword} value={flow.password} onChangeText={(v) => { flow.setPassword(v); flow.clearError("password"); }} secureTextEntry onSubmitEditing={flow.handleSubmit} error={flow.errors.password} containerStyle={s.mb16} />
          </>
        )}

        <Button title={flow.view === "signup" ? msg.btnSignupSubmit : msg.btnLogin} onPress={flow.handleSubmit} disabled={flow.loading} loading={flow.loading} variant="primary" style={s.mb12} />

        {flow.view === "signup" ? (
          <Button title={msg.backToLogin} onPress={() => { flow.setView("login"); flow.resetForm(); }} disabled={flow.loading} variant="secondary" style={s.mb16} />
        ) : (
          <>
            <Button title={msg.btnForgotPassword} onPress={() => flow.setView("forgotPassword")} disabled={flow.loading} variant="secondary" style={s.mb12} />
            <Divider label={msg.or} />
            {config.googleLogin && (
              <Button title={msg.btnGoogleLogin} onPress={flow.handleGoogleLogin} disabled={flow.loading} variant="secondary" icon={config.googleIcon} style={s.mb12} />
            )}
            <Button title={msg.btnSignup} onPress={() => { flow.setView("signup"); flow.resetForm(); setTimeout(() => flow.nameRef.current?.focus(), FOCUS_DELAY); }} disabled={flow.loading} variant="secondary" style={s.mb16} />
          </>
        )}
      </Body>
    </Screen>
  );
}

// --- Internal sub-views ---

function ForgotPasswordView({ flow }: { flow: ReturnType<typeof useAuthKitFlow> }) {
  const { msg } = useAuthKit();
  return (
    <Screen>
      <Body centered>
        <Text variant="title" align="center" style={s.mb8}>{msg.forgotPasswordTitle}</Text>
        <Text variant="subtitle" align="center" style={s.mb40}>{msg.forgotPasswordSubtitle}</Text>
        <TextInput ref={flow.fpEmailRef} label={msg.labelEmail} placeholder={msg.placeholderEmail} value={flow.fpEmail} onChangeText={(v) => { flow.setFpEmail(v); flow.setFpError(""); }} autoCapitalize="none" keyboardType="email-address" onSubmitEditing={flow.handleFpSubmit} error={flow.fpError} containerStyle={s.mb32} />
        <Button title={msg.btnSendOtp} onPress={flow.handleFpSubmit} disabled={flow.fpLoading} loading={flow.fpLoading} variant="primary" style={s.mb12} />
        <Button title={msg.backToLogin} onPress={() => flow.setView("login")} variant="secondary" />
      </Body>
    </Screen>
  );
}

function ResetPasswordView({ flow }: { flow: ReturnType<typeof useAuthKitFlow> }) {
  const { msg } = useAuthKit();
  return (
    <Screen>
      <Body centered>
        <Text variant="title" align="center" style={s.mb8}>{msg.resetPasswordTitle}</Text>
        <Text variant="subtitle" align="center" style={s.mb40}>{msg.resetPasswordSubtitle}</Text>
        <TextInput ref={flow.rpPasswordRef} label={msg.labelNewPassword} placeholder={msg.placeholderPasswordSignup} value={flow.rpPassword} onChangeText={(v) => { flow.setRpPassword(v); flow.rpClearError("password"); }} secureTextEntry onSubmitEditing={flow.handleRpSubmit} error={flow.rpErrors.password} containerStyle={s.mb4} />
        <PasswordStrengthView password={flow.rpPassword} rules={flow.passwordRules} />
        <TextInput ref={flow.rpConfirmRef} label={msg.labelNewPasswordConfirm} placeholder={msg.placeholderPasswordConfirm} value={flow.rpConfirm} onChangeText={(v) => { flow.setRpConfirm(v); flow.rpClearError("passwordConfirm"); }} secureTextEntry onSubmitEditing={flow.handleRpSubmit} error={flow.rpErrors.passwordConfirm} containerStyle={s.mb32} />
        <Button title={msg.btnChangePassword} onPress={flow.handleRpSubmit} disabled={flow.rpLoading} loading={flow.rpLoading} variant="primary" />
      </Body>
    </Screen>
  );
}

function OtpView({ email, type, onVerified, onBack }: { email: string; type: string; onVerified: () => void; onBack: () => void }) {
  const { config, msg } = useAuthKit();
  const theme = useTheme();
  const { remaining, expired, formatTime, restart } = useOtpTimer();

  const submitCode = async (token: string) => {
    if (expired) { setError(msg.otpExpired); return; }
    try {
      const { error } = await config.supabase.auth.verifyOtp({ email, token, type: type as any });
      if (error) { setError(msg.otpInvalid); resetCode(); }
      else onVerified();
    } catch { setError(msg.networkError); }
  };

  const { code, error, setError, inputRefs, resetCode, handleChange, handleKeyPress } = useOtpInput(submitCode);

  const handleResend = async () => {
    setError("");
    try {
      if (type === "signup") await config.supabase.auth.resend({ type: "signup", email });
      else await config.supabase.auth.resetPasswordForEmail(email);
      resetCode(); restart();
    } catch { setError(msg.resendFailed); }
  };

  return (
    <Screen>
      <Body centered>
        <Text variant="title" align="center" style={s.mb8}>{msg.otpTitle}</Text>
        <Text variant="subtitle" align="center" style={s.mb8}>{email}{msg.otpSubtitleSuffix}</Text>
        <Text variant="body" align="center" color={expired ? theme.colors.danger : theme.colors.focus} style={s.timer}>{expired ? msg.timerExpired : formatTime(remaining)}</Text>
        <View style={s.otpContainer}>
          {code.map((digit: string, i: number) => (
            <RNTextInput
              key={i}
              ref={(ref) => { inputRefs.current[i] = ref; }}
              style={[
                s.otpInput,
                { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary },
                digit ? { borderColor: theme.colors.focus } : null,
                error ? { borderColor: theme.colors.danger } : null,
                Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {},
              ]}
              value={digit}
              onChangeText={(v) => handleChange(v, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              keyboardType="number-pad"
              maxLength={i === 0 ? 6 : 1}
              selectTextOnFocus
            />
          ))}
        </View>
        {error ? <Text variant="caption" color={theme.colors.danger} align="center" style={s.mb16}>{error}</Text> : null}
        <View style={s.mb32} />
        {expired && <Button title={msg.btnResendOtp} onPress={handleResend} variant="primary" style={s.mb12} />}
        <Button title={msg.back} onPress={onBack} variant="secondary" />
      </Body>
    </Screen>
  );
}

function PasswordStrengthView({ password, rules }: { password: string; rules: { label: string; test: (p: string) => boolean }[] }) {
  const theme = useTheme();
  if (password === undefined) return null;
  return (
    <View style={s.pwContainer}>
      {rules.map((rule) => {
        const ok = rule.test(password);
        const color = ok ? "#22c55e" : theme.colors.textMuted;
        return (
          <View key={rule.label} style={s.pwRow}>
            <View style={s.pwIcon}><Text variant="caption" color={color} style={s.pwText}>{ok ? "✓" : "○"}</Text></View>
            <Text variant="caption" color={color} style={s.pwText}>{rule.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

function TermsView({ agreedTerms, agreedPrivacy, onToggleAll, onToggleTerms, onTogglePrivacy, onViewTerms, onViewPrivacy, error }: any) {
  const { msg } = useAuthKit();
  const theme = useTheme();

  const checkboxStyle = [s.checkbox, { borderColor: theme.colors.textMuted }];
  const checkedStyle = { backgroundColor: theme.colors.focus, borderColor: theme.colors.focus };

  return (
    <View style={s.termsContainer}>
      <View style={s.termsRow}>
        <View style={[...checkboxStyle, agreedTerms && agreedPrivacy && checkedStyle]}>
          {agreedTerms && agreedPrivacy && <Text variant="caption" color={theme.colors.primaryForeground}>✓</Text>}
        </View>
        <Text variant="body" onPress={onToggleAll} style={s.termsBold}>{msg.termsAgreeAll}</Text>
      </View>

      <View style={[s.termsDivider, { backgroundColor: theme.colors.border }]} />

      <View style={s.termsRowBetween}>
        <View style={s.termsRow}>
          <View style={[...checkboxStyle, agreedTerms && checkedStyle]}>
            {agreedTerms && <Text variant="caption" color={theme.colors.primaryForeground}>✓</Text>}
          </View>
          <Text variant="caption" onPress={onToggleTerms}>{msg.termsAgreeTos}</Text>
        </View>
        {onViewTerms && <Text variant="caption" color={theme.colors.focus} onPress={onViewTerms}>{msg.termsView}</Text>}
      </View>

      <View style={s.termsRowBetween}>
        <View style={s.termsRow}>
          <View style={[...checkboxStyle, agreedPrivacy && checkedStyle]}>
            {agreedPrivacy && <Text variant="caption" color={theme.colors.primaryForeground}>✓</Text>}
          </View>
          <Text variant="caption" onPress={onTogglePrivacy}>{msg.termsAgreePrivacy}</Text>
        </View>
        {onViewPrivacy && <Text variant="caption" color={theme.colors.focus} onPress={onViewPrivacy}>{msg.termsView}</Text>}
      </View>

      {error ? <Text variant="caption" color={theme.colors.danger} style={s.mt8}>{error}</Text> : null}
    </View>
  );
}

// Layout-only styles (no colors)
const s = StyleSheet.create({
  titleMargin: { marginBottom: 8, marginTop: 40 },
  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
  mb12: { marginBottom: 12 },
  mb16: { marginBottom: 16 },
  mb32: { marginBottom: 32 },
  mb40: { marginBottom: 40 },
  mt8: { marginTop: 8 },
  mt24: { marginTop: 24 },
  timer: { marginBottom: 32, fontSize: 20, fontWeight: "bold" },
  otpContainer: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 16 },
  otpInput: { width: 48, height: 56, borderRadius: 12, borderWidth: 1, borderColor: "transparent", textAlign: "center", fontSize: 24, fontWeight: "bold" },
  pwContainer: { marginTop: 4, marginBottom: 16 },
  pwRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  pwIcon: { width: 14, alignItems: "center" },
  pwText: { fontSize: 12 },
  termsContainer: { marginBottom: 24 },
  termsRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 12 },
  termsRowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  termsDivider: { height: 1, marginVertical: 4 },
  termsBold: { fontSize: 14 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1, alignItems: "center", justifyContent: "center" },
});
