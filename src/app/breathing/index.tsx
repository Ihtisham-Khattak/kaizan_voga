import { router, type Href } from 'expo-router';
import { CaretLeft, Clock } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CoverArt } from '@/components/cover-art';
import { FadeUp } from '@/components/fade-up';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { listBreathing } from '@/data/repo';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { usePrefsStore } from '@/store/prefs-store';
import type { Ambience } from '@/store/types';

const DURATIONS = [3, 5, 10];
const AMBIENCES: Ambience[] = ['rain', 'forest', 'piano', 'none'];
const AMB_KEY = { rain: 'rain', forest: 'forest', piano: 'piano', none: 'silence' } as const;

/** Breathing & Relax hub: six gentle practices, a duration and an ambience. Nothing forced. */
export default function BreathingHub() {
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const prefsAmbience = usePrefsStore((s) => s.ambience);
  const [minutes, setMinutes] = useState<number | null>(null);
  const [ambience, setAmbience] = useState<Ambience>(prefsAmbience);

  const open = (id: string, defaultMinutes: number) => {
    haptic.light();
    router.push({
      pathname: '/breathing/[id]',
      params: { id, minutes: String(minutes ?? defaultMinutes), ambience },
    } as Href);
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32, gap: 24 }}
      >
        <View className="flex-row items-center gap-2 px-2">
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
            className="size-12 items-center justify-center rounded-full"
          >
            <Icon as={CaretLeft} size={24} className="text-foreground" />
          </Pressable>
        </View>
        <View className="gap-1 px-4">
          <Text variant="title1" accessibilityRole="header">
            {t('breathingUi.title')}
          </Text>
          <Text variant="body" className="text-muted-foreground">
            {t('breathingUi.subtitle')}
          </Text>
        </View>

        <View className="gap-2 px-4">
          <Text variant="label">{t('breathingUi.duration')}</Text>
          <View className="flex-row flex-wrap gap-2">
            <Chip
              label={t('breathingUi.suggested')}
              selected={minutes === null}
              onPress={() => setMinutes(null)}
            />
            {DURATIONS.map((m) => (
              <Chip
                key={m}
                label={t('breathingUi.minutes', { count: m })}
                selected={minutes === m}
                onPress={() => setMinutes(m)}
                icon={<Icon as={Clock} size={16} />}
              />
            ))}
          </View>
        </View>

        <View className="gap-2 px-4">
          <Text variant="label">{t('breathingUi.ambience')}</Text>
          <View className="flex-row flex-wrap gap-2">
            {AMBIENCES.map((a) => (
              <Chip
                key={a}
                label={t(`onboardingR.voice.${AMB_KEY[a]}.title`)}
                selected={ambience === a}
                onPress={() => setAmbience(a)}
              />
            ))}
          </View>
        </View>

        <View className="gap-3 px-4">
          {listBreathing().map((b, i) => (
            <FadeUp key={b.id} delay={i * 60}>
              <Pressable
                onPress={() => open(b.id, b.defaultMinutes)}
                accessibilityRole="button"
                accessibilityLabel={`${b.title}, ${t('breathingUi.minutes', { count: minutes ?? b.defaultMinutes })}`}
                className="flex-row items-center gap-3 rounded-3xl bg-card p-3 active:opacity-80"
              >
                <CoverArt tint={b.cover} figure="breathing" height={84} width={84} rounded={20} />
                <View className="flex-1 gap-1">
                  <Text variant="heading" numberOfLines={1}>
                    {b.title}
                  </Text>
                  <Text variant="caption" numberOfLines={2}>
                    {b.description}
                  </Text>
                  <Text variant="caption" className="font-sans-semibold">
                    {t('breathingUi.minutes', { count: minutes ?? b.defaultMinutes })}
                  </Text>
                </View>
              </Pressable>
            </FadeUp>
          ))}
        </View>

        <Text variant="caption" className="px-6 text-center">
          {t('breathingUi.safety')}
        </Text>
      </ScrollView>
    </View>
  );
}
