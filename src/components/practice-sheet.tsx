import { router, type Href } from 'expo-router';
import { CaretRight, Play } from 'phosphor-react-native';
import { I18nManager, Pressable, View } from 'react-native';

import { BottomSheet } from '@/components/bottom-sheet';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { KaizenIcon, type KaizenIconName } from '@/icons';
import { useTodayPlan } from '@/lib/journey';
import { openCollection, startBreathing, startSession } from '@/lib/nav';
import { haptic } from '@/lib/haptics';
import { useLibraryStore } from '@/store/library-store';
import { usePrefsStore } from '@/store/prefs-store';
import { useSessionStore } from '@/store/session-store';
import { useUiStore } from '@/store/ui-store';
import { useTheme } from '@/theme/theme-provider';

function Row({
  icon,
  title,
  sub,
  onPress,
  play,
}: {
  icon: KaizenIconName | 'play';
  title: string;
  sub: string;
  onPress: () => void;
  play?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => {
        haptic.light();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${sub}`}
      className="min-h-[68px] flex-row items-center gap-3 rounded-2xl px-2 active:bg-secondary/60"
    >
      <View className="size-12 items-center justify-center rounded-full bg-secondary">
        {icon === 'play' ? (
          <Icon as={Play} size={22} weight="fill" className="text-primary" />
        ) : (
          <KaizenIcon name={icon} size={26} color={colors.primary} />
        )}
      </View>
      <View className="flex-1">
        <Text variant="bodyLarge" className="font-sans-semibold">
          {title}
        </Text>
        <Text variant="caption">{sub}</Text>
      </View>
      <Icon
        as={CaretRight}
        size={18}
        className="text-muted-foreground"
        style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
      />
    </Pressable>
  );
}

/** Opened by the centre Practice button: the four things you can do right now. */
export function PracticeSheet() {
  const { t } = useT();
  const open = useUiStore((s) => s.practiceSheet);
  const close = useUiStore((s) => s.closePractice);
  const last = useLibraryStore((s) => s.lastSession);
  const plan = useTodayPlan();
  const prefs = usePrefsStore();
  const setConfig = useSessionStore((s) => s.setConfig);
  /** Pick up where you left off: rebuild the settings (they are not kept between sessions) and start at the saved step. */
  const resume = () => {
    if (!last) return;
    if (last.kind === 'breathing') return startBreathing(last.contentId);
    setConfig({
      routineId: last.contentId,
      scale: 1,
      pace: 'normal',
      voice: prefs.voice,
      music: prefs.music,
      ambience: prefs.ambience,
      focus: [],
      chairMode: prefs.chairMode,
      startIndex: last.stepIndex,
    });
    router.push('/session/player' as Href);
  };
  const go = (fn: () => void) => () => {
    close();
    setTimeout(fn, 150);
  };

  return (
    <BottomSheet visible={open} onClose={close} title={t('practice.title')} snapPoints={[420]}>
      <View className="pb-2">
        <Row
          icon="practice"
          title={t('practice.today')}
          sub={plan.routine ? plan.routine.title : t('home.restTitle')}
          onPress={go(() => (plan.routine ? startSession(plan.routine.id) : startBreathing()))}
        />
        <Row
          icon="leaf"
          title={t('practice.breathing')}
          sub={t('practice.breathingSub')}
          onPress={go(() => startBreathing())}
        />
        <Row
          icon="energy"
          title={t('practice.quick')}
          sub={t('practice.quickSub')}
          onPress={go(() => openCollection('collection', 'quick-relief'))}
        />
        {last ? (
          <Row
            icon="play"
            title={t('practice.resume')}
            sub={t('practice.resumeSub')}
            onPress={go(() => resume())}
          />
        ) : null}
      </View>
    </BottomSheet>
  );
}
