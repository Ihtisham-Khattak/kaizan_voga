import { zodResolver } from '@hookform/resolvers/zod';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ErrorBanner, FormField } from '@/features/auth/fields';
import { useCooldown } from '@/features/auth/flow';
import { AuthScaffold } from '@/features/auth/scaffold';
import { useT } from '@/i18n';
import { requestPasswordReset } from '@/lib/auth';
import { forgotSchema, maskEmail, type ForgotValues } from '@/lib/validation';

/** Forgot password — enter email → "check your email" state with a 30 s resend cooldown. */
export default function ForgotPasswordScreen() {
  const { t } = useT();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cooldown = useCooldown(30);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema), mode: 'onBlur', defaultValues: { email: '' } });

  const send = async (email: string) => {
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSentTo(email);
      cooldown.restart();
    } catch {
      setError(t('auth.errors.offline'));
    } finally {
      setLoading(false);
    }
  };

  if (sentTo) {
    return (
      <AuthScaffold title={t('auth.forgot.sentTitle')} mood="happy" subtitle={t('auth.forgot.sentBody', { email: maskEmail(sentTo) })}>
        <Button size="lg" onPress={() => router.push({ pathname: '/verify-code', params: { flow: 'reset', email: sentTo } } as Href)}>
          <Text>{t('auth.forgot.enterCode')}</Text>
        </Button>
        <Button variant="secondary" disabled={cooldown.left > 0 || loading} loading={loading} onPress={() => send(sentTo)}>
          <Text>{cooldown.left > 0 ? t('auth.verify.resendIn', { seconds: cooldown.left }) : t('auth.verify.resend')}</Text>
        </Button>
        <Button variant="ghost" onPress={() => setSentTo(null)}>
          <Text>{t('auth.forgot.different')}</Text>
        </Button>
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold
      title={t('auth.forgot.title')}
      subtitle={t('auth.forgot.subtitle')}
      footer={
        <Button variant="ghost" onPress={() => router.replace('/sign-in')}>
          <Text>{t('auth.forgot.backToSignIn')}</Text>
        </Button>
      }
    >
      <ErrorBanner message={error} />
      <View>
        <FormField control={control} name="email" label={t('auth.email')} placeholder={t('auth.emailPh')} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" error={errors.email?.message ? t(errors.email.message) : undefined} />
      </View>
      <Button size="lg" loading={loading} onPress={handleSubmit((v) => send(v.email))}>
        <Text>{t('auth.forgot.send')}</Text>
      </Button>
    </AuthScaffold>
  );
}
