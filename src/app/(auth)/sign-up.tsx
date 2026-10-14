import { zodResolver } from '@hookform/resolvers/zod';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Text } from '@/components/ui/text';
import { ErrorBanner, FieldError, FormField, OrDivider, PasswordStrength, SocialButtons } from '@/features/auth/fields';
import { finishAuth } from '@/features/auth/flow';
import { AuthScaffold } from '@/features/auth/scaffold';
import { useT } from '@/i18n';
import { AuthError, signInWithProvider, signUp } from '@/lib/auth';
import { signUpSchema, type SignUpValues } from '@/lib/validation';

/** Sign up — name, email, password (with gentle strength hint), terms. Mock backend; real one is card FN-02. */
export default function SignUpScreen() {
  const { t } = useT();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', password: '', terms: false },
  });
  const password = useWatch({ control, name: 'password' });
  const msg = (k?: string) => (k ? t(k) : undefined);

  const submit = handleSubmit(async (v) => {
    setFormError(null);
    setLoading(true);
    try {
      await signUp(v);
      router.push({ pathname: '/verify-code', params: { flow: 'signup', email: v.email } } as Href);
    } catch (e) {
      setFormError(e instanceof AuthError && e.code === 'email-taken' ? t('auth.signUp.emailTaken') : t('auth.errors.offline'));
    } finally {
      setLoading(false);
    }
  });

  return (
    <AuthScaffold
      title={t('auth.signUp.title')}
      subtitle={t('auth.signUp.subtitle')}
      footer={
        <View className="flex-row flex-wrap items-center justify-center">
          <Text variant="body" className="text-muted-foreground">
            {t('auth.signUp.haveAccount')}{' '}
          </Text>
          <Pressable onPress={() => router.replace('/sign-in')} accessibilityRole="link" className="min-h-11 justify-center">
            <Text variant="label" className="text-primary">
              {t('auth.signUp.signIn')}
            </Text>
          </Pressable>
        </View>
      }
    >
      <ErrorBanner message={formError} />
      <FormField control={control} name="name" label={t('auth.signUp.name')} placeholder={t('auth.signUp.namePh')} autoComplete="name" textContentType="name" error={msg(errors.name?.message)} />
      <FormField control={control} name="email" label={t('auth.email')} placeholder={t('auth.emailPh')} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" error={msg(errors.email?.message)} />
      <View className="gap-2">
        <FormField control={control} name="password" label={t('auth.password')} password autoComplete="new-password" textContentType="newPassword" error={msg(errors.password?.message)} />
        <PasswordStrength password={password} hint={t('auth.signUp.passwordHint')} />
      </View>

      <View className="gap-1">
        <Controller
          control={control}
          name="terms"
          render={({ field: { value, onChange } }) => (
            <View className="flex-row items-center gap-3">
              <Checkbox checked={value} onCheckedChange={onChange} accessibilityLabel={t('auth.signUp.terms')} />
              <Pressable onPress={() => onChange(!value)} className="min-h-11 flex-1 justify-center" accessibilityRole="button">
                <Text variant="body">{t('auth.signUp.terms')}</Text>
              </Pressable>
            </View>
          )}
        />
        <FieldError message={msg(errors.terms?.message)} />
      </View>

      <Button size="lg" loading={loading} onPress={submit}>
        <Text>{t('auth.signUp.submit')}</Text>
      </Button>
      <OrDivider />
      <SocialButtons busy={loading} onPress={async (p) => finishAuth(await signInWithProvider(p))} />
    </AuthScaffold>
  );
}
