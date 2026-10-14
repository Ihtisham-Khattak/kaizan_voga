import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { CheckCircle, MinusCircle } from 'phosphor-react-native';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { FormField, PasswordStrength } from '@/features/auth/fields';
import { AuthScaffold } from '@/features/auth/scaffold';
import { useT } from '@/i18n';
import { resetPassword } from '@/lib/auth';
import { resetSchema, type ResetValues } from '@/lib/validation';

function Rule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <View className="flex-row items-center gap-2" accessible accessibilityLabel={`${label}: ${ok ? '✓' : '–'}`}>
      <Icon as={ok ? CheckCircle : MinusCircle} size={18} weight={ok ? 'fill' : 'regular'} className={ok ? 'text-primary' : 'text-muted-foreground'} />
      <Text variant="caption" className={ok ? 'text-foreground' : undefined}>
        {label}
      </Text>
    </View>
  );
}

/** Reset password — new + confirm, strength meter, requirement checklist, success state. */
export default function ResetPasswordScreen() {
  const { t } = useT();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetValues>({ resolver: zodResolver(resetSchema), mode: 'onBlur', defaultValues: { password: '', confirm: '' } });
  const pw = useWatch({ control, name: 'password' });
  const confirm = useWatch({ control, name: 'confirm' });
  const msg = (k?: string) => (k ? t(k) : undefined);

  if (done) {
    return (
      <AuthScaffold hideBack title={t('auth.reset.doneTitle')} subtitle={t('auth.reset.doneBody')} mood="happy">
        <Button size="lg" onPress={() => router.replace('/sign-in')}>
          <Text>{t('auth.reset.backToSignIn')}</Text>
        </Button>
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold title={t('auth.reset.title')} subtitle={t('auth.reset.subtitle')}>
      <View className="gap-2">
        <FormField control={control} name="password" label={t('auth.reset.newPassword')} password autoComplete="new-password" textContentType="newPassword" error={msg(errors.password?.message)} />
        <PasswordStrength password={pw} />
      </View>
      <FormField control={control} name="confirm" label={t('auth.reset.confirm')} password autoComplete="new-password" textContentType="newPassword" error={msg(errors.confirm?.message)} />
      <View className="gap-1.5">
        <Rule ok={pw.length >= 8} label={t('auth.reset.ruleLength')} />
        <Rule ok={/[a-z]/i.test(pw) && /\d/.test(pw)} label={t('auth.reset.ruleMix')} />
        <Rule ok={pw.length > 0 && pw === confirm} label={t('auth.reset.ruleMatch')} />
      </View>
      <Button
        size="lg"
        loading={loading}
        onPress={handleSubmit(async (v) => {
          setLoading(true);
          await resetPassword(v.password);
          setLoading(false);
          setDone(true);
        })}
      >
        <Text>{t('auth.reset.submit')}</Text>
      </Button>
    </AuthScaffold>
  );
}
