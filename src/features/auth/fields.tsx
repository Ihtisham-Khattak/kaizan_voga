import { AppleLogo, Eye, EyeSlash, GoogleLogo, WarningCircle } from 'phosphor-react-native';
import { MotiView } from 'moti';
import { useRef, useState } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Platform, Pressable, TextInput, View, type TextInputProps } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import { cn } from '@/lib/utils';
import { passwordScore } from '@/lib/validation';
import { useTheme } from '@/theme/theme-provider';

/** Inline error: icon + text (never colour alone), announced politely. */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <MotiView
      from={{ opacity: 0, translateY: -4 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 250 }}
      accessibilityLiveRegion="polite"
      className="flex-row items-center gap-1.5"
    >
      <Icon as={WarningCircle} size={16} weight="fill" className="text-destructive" />
      <Text variant="caption" className="flex-1 text-destructive">
        {message}
      </Text>
    </MotiView>
  );
}

/** Soft banner for form-level problems ("That email and password don't match…"). */
export function ErrorBanner({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      className="flex-row items-start gap-2 rounded-2xl bg-destructive/10 px-4 py-3"
    >
      <Icon as={WarningCircle} size={20} weight="fill" className="mt-0.5 text-destructive" />
      <Text variant="body" className="flex-1 text-destructive">
        {message}
      </Text>
    </View>
  );
}

interface FieldProps<T extends FieldValues> extends Omit<
  TextInputProps,
  'value' | 'onChangeText' | 'onBlur'
> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  /** Error message already translated. */
  error?: string;
  password?: boolean;
}

/** Labelled text field bound to react-hook-form. Password fields get a show/hide toggle. */
export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  error,
  password,
  ...input
}: FieldProps<T>) {
  const { t } = useT();
  const [hidden, setHidden] = useState(!!password);
  return (
    <View className="gap-2">
      <Text variant="label">{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, onBlur } }) => (
          <View>
            <Input
              {...input}
              value={value as string}
              onChangeText={onChange}
              onBlur={onBlur}
              invalid={!!error}
              secureTextEntry={password ? hidden : input.secureTextEntry}
              accessibilityLabel={label}
              className={password ? 'pe-14' : undefined}
            />
            {password ? (
              <Pressable
                onPress={() => setHidden((h) => !h)}
                accessibilityRole="button"
                accessibilityLabel={hidden ? t('a11y.showPassword') : t('a11y.hidePassword')}
                style={{ position: 'absolute', end: 4, top: 6 }}
                className="size-11 items-center justify-center"
              >
                <Icon as={hidden ? Eye : EyeSlash} size={22} className="text-muted-foreground" />
              </Pressable>
            ) : null}
          </View>
        )}
      />
      <FieldError message={error} />
    </View>
  );
}

/** Four-segment bar + a word. Gentle: only the 8-character minimum is enforced. */
export function PasswordStrength({ password, hint }: { password: string; hint?: string }) {
  const { t } = useT();
  const { colors } = useTheme();
  const score = passwordScore(password);
  if (!password) return hint ? <Text variant="caption">{hint}</Text> : null;
  const word = ['weak', 'weak', 'fair', 'good', 'strong'][score] as 'weak' | 'fair' | 'good' | 'strong';
  const bar = [colors.muted, colors.muted, colors.sky, colors.leaf, colors.primary];
  return (
    <View
      className="gap-1.5"
      accessible
      accessibilityLabel={`${t('auth.password')}: ${t(`auth.strength.${word}`)}`}
    >
      <View className="flex-row gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <MotiView
            key={i}
            animate={{ backgroundColor: i <= score ? bar[score] : colors.hairline }}
            transition={{ type: 'timing', duration: 300 }}
            style={{ flex: 1, height: 6, borderRadius: 3 }}
          />
        ))}
      </View>
      <Text variant="caption">{`${t(`auth.strength.${word}`)}${hint ? ' · ' + hint : ''}`}</Text>
    </View>
  );
}

/** Six boxes backed by ONE hidden input, so paste, autofill (oneTimeCode) and backspace all just work. */
export function OtpInput({
  value,
  onChange,
  length = 6,
  error,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  error?: boolean;
  label: string;
}) {
  const ref = useRef<TextInput>(null);
  const reduce = useReduceMotion();
  const [focused, setFocused] = useState(true);
  return (
    <View>
      <MotiView
        key={error ? 'err' : 'ok'}
        from={{ translateX: 0 }}
        animate={{ translateX: error && !reduce ? [0, -8, 8, -6, 6, 0] : 0 }}
        transition={{ type: 'timing', duration: 400 }}
      >
        <Pressable
          onPress={() => ref.current?.focus()}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <View className="flex-row justify-between gap-2">
            {Array.from({ length }).map((_, i) => {
              const active = focused && i === Math.min(value.length, length - 1);
              return (
                <View
                  key={i}
                  className={cn(
                    'h-14 flex-1 items-center justify-center rounded-2xl border-2 bg-card',
                    error ? 'border-destructive' : active ? 'border-leaf' : 'border-border'
                  )}
                >
                  <Text variant="heading">{value[i] ?? ''}</Text>
                </View>
              );
            })}
          </View>
        </Pressable>
      </MotiView>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(v) => onChange(v.replace(/\D/g, '').slice(0, length))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        autoFocus
        accessibilityLabel={label}
        style={{ position: 'absolute', opacity: 0.01, width: '100%', height: 56 }}
      />
    </View>
  );
}

/** Apple (iOS/web) and Google buttons. UI only – they sign in a mock user. */
export function SocialButtons({
  onPress,
  busy,
}: {
  onPress: (p: 'apple' | 'google') => void;
  busy?: boolean;
}) {
  const { t } = useT();
  return (
    <View className="gap-3">
      {Platform.OS !== 'android' ? (
        <Button variant="outline" size="lg" disabled={busy} onPress={() => onPress('apple')}>
          <Icon as={AppleLogo} size={20} weight="fill" />
          <Text>{t('auth.gate.apple')}</Text>
        </Button>
      ) : null}
      <Button variant="outline" size="lg" disabled={busy} onPress={() => onPress('google')}>
        <Icon as={GoogleLogo} size={20} weight="bold" />
        <Text>{t('auth.gate.google')}</Text>
      </Button>
    </View>
  );
}

export function OrDivider() {
  const { t } = useT();
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-px flex-1 bg-border" />
      <Text variant="caption">{t('auth.or')}</Text>
      <View className="h-px flex-1 bg-border" />
    </View>
  );
}
