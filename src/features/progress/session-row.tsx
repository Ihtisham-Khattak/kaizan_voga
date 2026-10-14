import { CaretRight } from 'phosphor-react-native';
import { Pressable, View } from 'react-native';

import { MoodFace } from '@/components/mood-picker';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { formatDuration } from '@/lib/format';
import type { SessionRecord } from '@/store/types';

interface Props {
  session: SessionRecord;
  onPress: () => void;
  /** Show the date next to the duration (history) instead of just the time (a single day's list). */
  showDate?: boolean;
}

/** One practised session: title, length, and a small before → after mood pair when both were logged. */
export function SessionRow({ session, onPress, showDate }: Props) {
  const { t, i18n } = useT();
  const when = new Date(session.at);
  const stamp = new Intl.DateTimeFormat(
    i18n.language,
    showDate ? { weekday: 'short', day: 'numeric', month: 'short' } : { hour: 'numeric', minute: '2-digit' }
  ).format(when);
  const duration = formatDuration(session.practicedSec, t);
  const mood =
    session.moodBefore && session.moodAfter
      ? t('prog.hist.moodShift', {
          before: t(`mood.${session.moodBefore}`),
          after: t(`mood.${session.moodAfter}`),
        })
      : '';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${session.title}, ${duration}, ${stamp}${mood ? ', ' + mood : ''}`}
      className="min-h-16 flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 active:opacity-80"
    >
      <View className="flex-1 gap-1">
        <Text variant="label" numberOfLines={1}>
          {session.title}
        </Text>
        <Text variant="caption" numberOfLines={1}>
          {`${duration} · ${stamp}${session.completed ? '' : ' · ' + t('prog.hist.partial')}`}
        </Text>
      </View>
      {session.moodBefore && session.moodAfter ? (
        <View className="flex-row items-center gap-1" importantForAccessibility="no-hide-descendants">
          <MoodFace mood={session.moodBefore} size={26} />
          <Icon as={CaretRight} size={12} className="text-muted-foreground" />
          <MoodFace mood={session.moodAfter} size={26} />
        </View>
      ) : null}
      <Icon as={CaretRight} size={18} className="text-muted-foreground" />
    </Pressable>
  );
}
