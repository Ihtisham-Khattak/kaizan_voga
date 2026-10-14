import { useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { MoodFace } from '@/components/mood-picker';
import { ScreenHeader } from '@/components/screen-header';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { formatDuration } from '@/lib/format';
import { startBreathing, startSession } from '@/lib/nav';
import { useProgressStore } from '@/store/progress-store';

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center gap-1 rounded-2xl border border-border bg-card px-2 py-3">
      <Text variant="title">{value}</Text>
      <Text variant="caption" className="text-center">
        {label}
      </Text>
    </View>
  );
}

/** One session: the numbers, how you felt, your note, and a way to do it again. */
export default function SessionDetail() {
  const { t, i18n } = useT();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const s = useProgressStore((st) => st.sessions.find((x) => x.id === String(id)));

  if (!s) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader title={t('prog.hist.detail')} />
        <EmptyState title={t('prog.hist.notFound')} mood="tired" />
      </View>
    );
  }

  const when = new Intl.DateTimeFormat(i18n.language, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(s.at));
  const replay = () => (s.kind === 'breathing' ? startBreathing(s.contentId) : startSession(s.contentId));

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32, gap: 16 }}>
        <ScreenHeader
          title={s.title}
          subtitle={`${when}${s.completed ? '' : ' · ' + t('prog.hist.partial')}`}
        />
        <View className="flex-row gap-3 px-4">
          <Fact label={t('prog.hist.practiced')} value={formatDuration(s.practicedSec, t)} />
          <Fact label={t('prog.hist.planned')} value={formatDuration(s.plannedSec, t)} />
          {s.kind === 'breathing' ? null : <Fact label={t('prog.hist.poses')} value={String(s.posesDone)} />}
        </View>

        {s.moodBefore || s.moodAfter ? (
          <View className="mx-4 gap-2 rounded-3xl border border-border bg-card p-4">
            <Text variant="heading">{t('prog.hist.mood')}</Text>
            <View className="flex-row items-center justify-around">
              {s.moodBefore ? (
                <View className="items-center gap-1">
                  <MoodFace mood={s.moodBefore} size={52} />
                  <Text variant="caption">{`${t('prog.mood.before')}: ${t(`mood.${s.moodBefore}`)}`}</Text>
                </View>
              ) : null}
              {s.moodAfter ? (
                <View className="items-center gap-1">
                  <MoodFace mood={s.moodAfter} size={52} />
                  <Text variant="caption">{`${t('prog.mood.after')}: ${t(`mood.${s.moodAfter}`)}`}</Text>
                </View>
              ) : null}
            </View>
          </View>
        ) : null}

        <View className="mx-4 gap-1 rounded-3xl border border-border bg-card p-4">
          <Text variant="heading">{t('prog.hist.note')}</Text>
          <Text variant="body" className={s.note ? '' : 'text-muted-foreground'}>
            {s.note ?? t('prog.hist.noNote')}
          </Text>
        </View>

        <View className="px-4">
          <Button size="lg" onPress={replay}>
            <Text>{t('prog.hist.replay')}</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
