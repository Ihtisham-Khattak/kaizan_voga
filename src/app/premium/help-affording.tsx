import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Character } from '@/characters/character';
import { AuroraBackground } from '@/components/aurora-background';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { SettingsScreen } from '@/features/settings/ui';
import { useT } from '@/i18n';
import { useAuthStore } from '@/store/auth-store';
import { usePrefsStore } from '@/store/prefs-store';
import { safeBack } from '@/lib/nav';

const DURATIONS = ['three', 'six', 'twelve'] as const;

/** Financial-hardship request (M-05). Warm tone, no promise of approval. UI only – FN-15 wires it to an inbox. */
export default function HelpAffording() {
  const { t } = useT();
  const user = useAuthStore((s) => s.user);
  const savedName = usePrefsStore((s) => s.name);
  const [name, setName] = useState(savedName || user?.name || '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [note, setNote] = useState('');
  const [duration, setDuration] = useState<(typeof DURATIONS)[number]>('three');
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const missing = touched && (!name.trim() || !email.trim());

  if (sent)
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
        <AuroraBackground />
        <Character name="kai" pose="float" mood="happy" size={150} />
        <Text variant="title1" className="text-center" accessibilityRole="header">
          {t('premium.hardship.thanksTitle')}
        </Text>
        <Text variant="bodyLarge" className="text-center text-muted-foreground">
          {t('premium.hardship.thanksBody')}
        </Text>
        <Button size="lg" onPress={() => safeBack()}>
          <Text>{t('premium.hardship.done')}</Text>
        </Button>
      </View>
    );

  return (
    <SettingsScreen title={t('premium.hardship.title')} subtitle={t('premium.hardship.body')} keyboard>
      <View className="gap-4 px-4">
        <View className="gap-1.5">
          <Text variant="callout">{t('premium.hardship.name')}</Text>
          <Input
            value={name}
            onChangeText={setName}
            autoComplete="name"
            invalid={touched && !name.trim()}
            accessibilityLabel={t('premium.hardship.name')}
          />
        </View>
        <View className="gap-1.5">
          <Text variant="callout">{t('premium.hardship.email')}</Text>
          <Input
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            invalid={touched && !email.trim()}
            accessibilityLabel={t('premium.hardship.email')}
          />
        </View>
        <View className="gap-2">
          <Text variant="callout">{t('premium.hardship.duration')}</Text>
          <View className="flex-row flex-wrap gap-2" role="radiogroup">
            {DURATIONS.map((d) => (
              <Chip
                key={d}
                label={t(`premium.hardship.durations.${d}`)}
                selected={duration === d}
                onPress={() => setDuration(d)}
              />
            ))}
          </View>
        </View>
        <View className="gap-1.5">
          <Text variant="callout">{t('premium.hardship.note')}</Text>
          <Input
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="min-h-28"
            accessibilityLabel={t('premium.hardship.note')}
          />
        </View>
        {missing ? (
          <Text variant="footnote" className="text-danger" accessibilityLiveRegion="polite">
            {t('premium.hardship.required')}
          </Text>
        ) : null}
        <Button
          size="lg"
          onPress={() => {
            setTouched(true);
            if (name.trim() && email.trim()) setSent(true);
          }}
        >
          <Text>{t('premium.hardship.submit')}</Text>
        </Button>
      </View>
    </SettingsScreen>
  );
}
