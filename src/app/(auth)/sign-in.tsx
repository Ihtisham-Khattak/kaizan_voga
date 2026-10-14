import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { ErrorBanner, FormField, OrDivider, SocialButtons } from '@/features/auth/fields';
import { finishAuth } from '@/features/auth/flow';
import { AuthScaffold } from '@/features/auth/scaffold';
import { useT } from '@/i18n';
import { AuthError, signIn, signInWithProvider } from '@/lib/auth';
import { signInSchema, type SignInValues } from '@/lib/validation';

/** Sign in — email + password, forgot-password link, remember me, biometric opt-in (UI only). */
export default function SignInScreen() {
  const { t } = useT();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });
  const msg = (k?: string) => (k ? t(k) : undefined);

  const submit = handleSubmit(async (v) => {
    setFormError(null);
    setLoading(true);
    try {
      finishAuth(await signIn(v));
    } catch (e) {
      setFormError(
        e instanceof AuthError && e.code === 'invalid-credentials'
          ? t('auth.signIn.wrong')
          : t('auth.errors.offline')
      );
      setLoading(false);
    }
  });

  return (
    <AuthScaffold
      title={t('auth.signIn.title')}
      subtitle={t('auth.signIn.subtitle')}
      footer={
        <View className="flex-row flex-wrap items-center justify-center">
          <Text variant="body" className="text-muted-foreground">
            {t('auth.signIn.newHere')}{' '}
          </Text>
          <Pressable
            onPress={() => router.replace('/sign-up')}
            accessibilityRole="link"
            className="min-h-11 justify-center"
          >
            <Text variant="label" className="text-primary">
              {t('auth.signIn.create')}
            </Text>
          </Pressable>
        </View>
      }
    >
      <ErrorBanner message={formError} />
      <FormField
        control={control}
        name="email"
        label={t('auth.email')}
        placeholder={t('auth.emailPh')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        error={msg(errors.email?.message)}
      />
      <FormField
        control={control}
        name="password"
        label={t('auth.password')}
        password
        autoComplete="current-password"
        textContentType="password"
        error={msg(errors.password?.message)}
      />

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Switch
            checked={remember}
            onCheckedChange={setRemember}
            accessibilityLabel={t('auth.signIn.remember')}
          />
          <Text variant="caption">{t('auth.signIn.remember')}</Text>
        </View>
        <Pressable
          onPress={() => router.push('/forgot-password')}
          accessibilityRole="link"
          className="min-h-11 justify-center"
        >
          <Text variant="label" className="text-primary">
            {t('auth.signIn.forgot')}
          </Text>
        </Pressable>
      </View>

      <Button size="lg" loading={loading} onPress={submit}>
        <Text>{t('auth.signIn.submit')}</Text>
      </Button>

      <View className="flex-row items-center gap-3">
        <Switch
          checked={biometric}
          onCheckedChange={setBiometric}
          accessibilityLabel={t('auth.signIn.biometric')}
        />
        <Text variant="caption" className="flex-1">
          {t('auth.signIn.biometric')}
        </Text>
      </View>

      <OrDivider />
      <SocialButtons busy={loading} onPress={async (p) => finishAuth(await signInWithProvider(p))} />
    </AuthScaffold>
  );
}
