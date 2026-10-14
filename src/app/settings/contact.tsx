import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { SettingsScreen } from '@/features/settings/ui';
import { useT } from '@/i18n';
import { useAuthStore } from '@/store/auth-store';
import { usePrefsStore } from '@/store/prefs-store';

/** Contact support form (UI only – FN-15 wires it to a real inbox). */
export default function ContactScreen() {
  const { t } = useT();
  const user = useAuthStore((s) => s.user);
  const savedName = usePrefsStore((s) => s.name);
  const [name, setName] = useState(savedName || user?.name || '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [touched, setTouched] = useState(false);
  const missing = touched && message.trim().length === 0;

  const send = () => {
    setTouched(true);
    if (!message.trim()) return;
    toast.success(t('pf.info.contactSent'));
    router.back();
  };

  return (
    <SettingsScreen title={t('pf.info.contactTitle')} subtitle={t('pf.info.contactSubtitle')} keyboard>
      <View className="gap-4 px-4">
        <View className="gap-1.5">
          <Text variant="label">{t('pf.info.contactName')}</Text>
          <Input
            value={name}
            onChangeText={setName}
            autoComplete="name"
            accessibilityLabel={t('pf.info.contactName')}
          />
        </View>
        <View className="gap-1.5">
          <Text variant="label">{t('pf.info.contactEmail')}</Text>
          <Input
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            accessibilityLabel={t('pf.info.contactEmail')}
          />
        </View>
        <View className="gap-1.5">
          <Text variant="label">{t('pf.info.contactSubject')}</Text>
          <Input value={subject} onChangeText={setSubject} accessibilityLabel={t('pf.info.contactSubject')} />
        </View>
        <View className="gap-1.5">
          <Text variant="label">{t('pf.info.contactMessage')}</Text>
          <Input
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            invalid={missing}
            className="min-h-32"
            accessibilityLabel={t('pf.info.contactMessage')}
          />
          {missing ? (
            <Text variant="caption" className="text-destructive" accessibilityLiveRegion="polite">
              {t('pf.info.contactRequired')}
            </Text>
          ) : null}
        </View>
        <Button size="lg" onPress={send}>
          <Text>{t('pf.info.contactSend')}</Text>
        </Button>
      </View>
    </SettingsScreen>
  );
}
