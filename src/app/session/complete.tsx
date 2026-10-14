import { router, type Href } from 'expo-router';
import { ArrowRight } from 'phosphor-react-native';
import { MotiView } from 'moti';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Character } from '@/characters/character';
import { ConfettiLeaves, LightRays } from '@/characters/props';
import { AuroraBackground } from '@/components/aurora-background';
import { GlassCard } from '@/components/glass-card';
import { MoodFace, MoodPicker } from '@/components/mood-picker';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { toast } from '@/components/toast';
import { listAchievements } from '@/data/repo';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { isSameDay } from '@/lib/journey';
import { KaizenIcon, type KaizenIconName } from '@/icons';
import { useProgressStore } from '@/store/progress-store';
import { useSessionStore } from '@/store/session-store';
import { useTheme } from '@/theme/theme-provider';
import type { Mood } from '@/store/types';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <GlassCard
      radius={20}
      shadow={false}
      style={{ flex: 1 }}
      contentStyle={{ padding: 16, alignItems: 'center', gap: 4 }}
    >
      <Text variant="title">{value}</Text>
      <Text variant="caption">{label}</Text>
    </GlassCard>
  );
}

/** Session complete: warm, never guilt-inducing. Partial sessions get a kind message, not a failure. */
export default function SessionComplete() {
  const { t } = useT();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const summary = useSessionStore((s) => s.summary);
  const setSummary = useSessionStore((s) => s.setSummary);
  const { addSession, updateSession, logMood, unlock, sessions, moodLogs } = useProgressStore();

  const [after, setAfter] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [openedAt] = useState(() => new Date().toISOString());
  const unlocked = useProgressStore((s) => s.achievementsUnlocked);
  const saved = useRef(false);

  // Before-mood: whatever was logged most recently today (Home check-in or a "before" log).
  const before = moodLogs.find((m) => m.context !== 'after' && isSameDay(new Date(m.at), new Date()))?.mood;

  // Save the record as soon as the screen appears, so closing the app here never loses the practice.
  useEffect(() => {
    if (!summary || saved.current) return;
    saved.current = true;
    const isFirst = !sessions.some((s) => s.completed);
    addSession({ ...summary, at: new Date().toISOString(), moodBefore: before });
    if (summary.completed) {
      haptic.success();
      const id = summary.kind === 'breathing' ? 'first-breath' : isFirst ? 'first-step' : null;
      if (id && !useProgressStore.getState().achievementsUnlocked[id]) {
        unlock(id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary]);

  if (!summary) {
    // Opened directly (e.g. a deep link): nothing to show, send them home.
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
        <Character name="kai" mood="calm" size={140} />
        <Button onPress={() => router.replace('/home' as Href)}>
          <Text>{t('comingSoon.cta')}</Text>
        </Button>
      </View>
    );
  }

  const full = summary.completed;
  // Anything unlocked since this screen opened is "new" – derived, so no state is set from the effect.
  const achievement = listAchievements().find((a) => (unlocked[a.id] ?? '') >= openedAt);
  const minutes = Math.max(1, Math.round(summary.practicedSec / 60));

  const done = () => {
    if (after) {
      updateSession(summary.id, { moodAfter: after, note: note.trim() || undefined });
      logMood(after, 'after', summary.id);
    } else if (note.trim()) updateSession(summary.id, { note: note.trim() });
    setSummary(null);
    router.replace('/home' as Href);
  };

  return (
    <View className="flex-1 bg-background">
      <AuroraBackground />
      <LightRays width={width} height={320} />
      {full ? <ConfettiLeaves width={width} height={420} /> : null}
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: 48,
          paddingHorizontal: 24,
          gap: 16,
          alignItems: 'center',
        }}
        keyboardShouldPersistTaps="handled"
      >
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 600 }}
        >
          <Character
            name="kai"
            pose={full ? 'celebrate' : 'float'}
            mood={full ? 'happy' : 'calm'}
            size={170}
          />
        </MotiView>
        <View className="items-center gap-1">
          <Text variant="display" className="text-center" accessibilityRole="header">
            {full ? t('session.complete.title') : t('session.complete.partialTitle')}
          </Text>
          <Text variant="body" className="text-center">
            {full ? t('session.complete.subtitle') : t('session.complete.partialSub')}
          </Text>
        </View>

        <View className="w-full flex-row gap-3">
          <Stat label={t('session.complete.time')} value={t('session.complete.min', { count: minutes })} />
          {summary.kind === 'breathing' ? null : (
            <Stat label={t('session.complete.poses')} value={String(summary.posesDone)} />
          )}
        </View>

        {achievement ? (
          <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 500 }}
            style={{ width: '100%' }}
          >
            <GlassCard
              radius={24}
              tone="leaf"
              contentStyle={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}
            >
              <View className="size-14 items-center justify-center rounded-full bg-secondary">
                <KaizenIcon name={achievement.icon as KaizenIconName} size={30} color={colors.leaf} />
              </View>
              <View className="flex-1">
                <Text variant="caption" className="font-sans-semibold uppercase tracking-wide">
                  {t('session.complete.achievement')}
                </Text>
                <Text variant="heading">{achievement.title}</Text>
                <Text variant="caption">{achievement.kaiMessage}</Text>
              </View>
            </GlassCard>
          </MotiView>
        ) : null}

        <View className="w-full gap-3 rounded-3xl bg-card p-4">
          <Text variant="heading" accessibilityRole="header">
            {t('session.complete.howNow')}
          </Text>
          {before ? (
            <View className="flex-row items-center gap-2">
              <Text variant="caption">{t('session.complete.before')}</Text>
              <MoodFace mood={before} size={28} />
              <Icon as={ArrowRight} size={14} className="text-muted-foreground" />
              <Text variant="caption">{t('session.complete.after')}</Text>
              {after ? <MoodFace mood={after} size={28} /> : null}
            </View>
          ) : null}
          <MoodPicker value={after} onChange={setAfter} size={44} />
          <Input
            value={note}
            onChangeText={setNote}
            placeholder={t('session.complete.notePh')}
            multiline
            accessibilityLabel={t('session.complete.notePh')}
          />
        </View>
      </ScrollView>

      <GlassCard
        strong
        radii={{ tl: 28, tr: 28 }}
        shadow={false}
        style={{ position: 'absolute', start: 0, end: 0, bottom: 0 }}
        contentStyle={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom, 14),
          flexDirection: 'row',
          gap: 12,
        }}
      >
        <Button
          variant="secondary"
          className="flex-1"
          onPress={() => toast.info(t('session.complete.shareSoon'))}
        >
          <Text>{t('session.complete.share')}</Text>
        </Button>
        <Button className="flex-[2]" size="lg" onPress={done}>
          <Text>{t('session.complete.done')}</Text>
        </Button>
      </GlassCard>
    </View>
  );
}
