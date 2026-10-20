import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ErrorBanner, OtpInput } from '@/features/auth/fields';
import { finishAuth, useCooldown } from '@/features/auth/flow';
import { AuthScaffold } from '@/features/auth/scaffold';
import { useT } from '@/i18n';
import { finishSignUp, verifyCode } from '@/lib/auth';
import { maskEmail } from '@/lib/validation';
import { safeBack } from '@/lib/nav';

/** Verify code — 6-box code entry for sign-up verification and password reset. (Mock: 000000 fails.) */
export default function VerifyCodeScreen() {
  const { t } = useT();
  const { flow = 'signup', email = '' } = useLocalSearchParams<{ flow?: string; email?: string }>();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const cooldown = useCooldown(30);

  const submit = async (value: string) => {
    setLoading(true);
    setError(false);
    try {
      await verifyCode(value);
      if (flow === 'reset') router.replace('/reset-password' as Href);
      else finishAuth(await finishSignUp());
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <AuthScaffold
      title={t('auth.verify.title')}
      subtitle={t('auth.verify.subtitle', { email: maskEmail(String(email)) })}
    >
      <ErrorBanner message={error ? t('auth.verify.wrong') : null} />
      <OtpInput
        value={code}
        onChange={(v) => {
          setError(false);
          setCode(v);
          // verify as soon as the 6th digit is in
          if (v.length === 6 && !loading) submit(v);
        }}
        error={error}
        label={t('auth.otpLabel')}
      />
      <Button size="lg" loading={loading} disabled={code.length < 6} onPress={() => submit(code)}>
        <Text>{t('auth.verify.submit')}</Text>
      </Button>
      <View className="items-center gap-1">
        <Button variant="ghost" disabled={cooldown.left > 0} onPress={cooldown.restart}>
          <Text>
            {cooldown.left > 0
              ? t('auth.verify.resendIn', { seconds: cooldown.left })
              : t('auth.verify.resend')}
          </Text>
        </Button>
        <Button variant="ghost" onPress={() => safeBack()}>
          <Text>{t('auth.verify.change')}</Text>
        </Button>
      </View>
    </AuthScaffold>
  );
}
