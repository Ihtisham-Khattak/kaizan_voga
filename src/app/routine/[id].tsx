import { router, useLocalSearchParams } from 'expo-router';
import { ArrowDown, Check } from 'phosphor-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CoverArt, variantFor } from '@/components/cover-art';
import { EmptyState } from '@/components/empty-state';
import { GlassCard } from '@/components/glass-card';
import { ProgressRing } from '@/components/progress-ring';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { getExercise, type RoutinePhase } from '@/data/repo';
import { HeroActions } from '@/features/pose/hero-actions';
import { PremiumBadge } from '@/components/premium-badge';
import { gate } from '@/lib/entitlement';
import { DetailSkeleton } from '@/features/states/skeletons';
import { useScreenLoading } from '@/hooks/use-screen-loading';
import { useT } from '@/i18n';
import { KaizenIcon, type KaizenIconName } from '@/icons';
import { formatDuration, minutesOf } from '@/lib/format';
import { openPose, startSession } from '@/lib/nav';
import { resolveRoutine } from '@/lib/routines';
import { useDownload } from '@/lib/use-download';
import { useLibraryStore } from '@/store/library-store';
import { useTheme } from '@/theme/theme-provider';

const PHASES: RoutinePhase[] = ['settle', 'warm-up', 'main', 'cool-down', 'close'];
const EQ_ICON: Record<string, KaizenIconName> = {
  mat: 'mat',
  chair: 'chair',
  blocks: 'blocks',
  strap: 'strap',
  cushion: 'cushion',
};

/** Routine detail: cover, description, goals, equipment, offline download, ordered poses by phase, sticky Start. */
export default function RoutineDetail() {
  const { t } = useT();
  const loading = useScreenLoading();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const r = resolveRoutine(String(id));
  const favorites = useLibraryStore((s) => s.favorites);
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const dl = useDownload(String(id));

  if (!r) {
    return (
      <View className="flex-1 justify-center bg-background">
        <EmptyState
          mood="tired"
          title={t('pose.notFound.title')}
          body={t('pose.notFound.body')}
          cta={{ label: t('common.back'), onPress: () => router.back() }}
        />
      </View>
    );
  }
  const favKey = `routine:${r.id}`;
  const first = r.steps.find((s) => s.phase === 'main') ?? r.steps[0];
  const grouped = PHASES.map((p) => ({ phase: p, steps: r.steps.filter((s) => s.phase === p) })).filter(
    (g) => g.steps.length
  );

  if (loading) return <DetailSkeleton />;

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        <View style={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden' }}>
          <CoverArt
            tint={r.cover}
            figure={variantFor(getExercise(first.exerciseId))}
            height={270}
            rounded={0}
            figureSize={170}
          />
          <View style={{ position: 'absolute', bottom: 12, start: 14 }}>
            <PremiumBadge id={r.id} premium={r.premium} contentKind={r.kind} />
          </View>
        </View>

        <View className="gap-4 px-4 pt-6">
          <View className="gap-1">
            <Text variant="title1" accessibilityRole="header">
              {r.title}
            </Text>
            {r.subtitle && !r.id.startsWith('custom:') ? (
              <Text variant="lead" className="text-muted-foreground">
                {r.subtitle}
              </Text>
            ) : null}
          </View>
          {r.description ? <Text variant="body">{r.description}</Text> : null}

          <View className="flex-row flex-wrap gap-2">
            <Badge variant="secondary">
              <Text>{t('common.minutes', { count: minutesOf(r.totalSec) })}</Text>
            </Badge>
            <Badge variant="outline">
              <Text>{t(`level.${r.level}`)}</Text>
            </Badge>
            {r.goals.map((g) => (
              <Badge key={g} variant="secondary">
                <Text>{t(`goal.${g}`)}</Text>
              </Badge>
            ))}
            {r.chairFriendly ? (
              <Badge variant="sky">
                <Text>{t('routine.chairFriendly')}</Text>
              </Badge>
            ) : null}
          </View>

          {/* equipment */}
          <View className="gap-2 rounded-card border border-border bg-card p-4">
            <Text variant="label">{t('routine.equipment')}</Text>
            {r.equipment.length ? (
              <View className="flex-row flex-wrap gap-3">
                {r.equipment.map((e) => (
                  <View key={e} className="flex-row items-center gap-2">
                    <View className="size-9 items-center justify-center rounded-full bg-secondary">
                      <KaizenIcon name={EQ_ICON[e] ?? 'leaf'} size={20} color={colors.primary} />
                    </View>
                    <Text variant="body">{t(`onboardingQ.equipment.${e}`)}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text variant="caption">{t('routine.noEquipment')}</Text>
            )}
          </View>

          {/* offline download (mock) */}
          <View className="flex-row items-center gap-3 rounded-card bg-secondary p-4">
            {dl.status === 'downloading' ? (
              <ProgressRing progress={dl.progress} size={44} strokeWidth={5} />
            ) : (
              <View className="size-11 items-center justify-center rounded-full bg-card">
                <Icon
                  as={dl.status === 'downloaded' ? Check : ArrowDown}
                  size={20}
                  weight="bold"
                  className="text-primary"
                />
              </View>
            )}
            <Text variant="label" className="flex-1">
              {dl.status === 'downloaded'
                ? t('routine.downloaded')
                : dl.status === 'downloading'
                  ? t('routine.downloading')
                  : t('routine.download')}
            </Text>
            {dl.status === 'none' ? (
              <Button
                size="sm"
                variant="outline"
                onPress={() => gate({ kind: 'feature', feature: 'downloads' }) && dl.start()}
              >
                <Text>{t('routine.download')}</Text>
              </Button>
            ) : dl.status === 'downloaded' ? (
              <Button size="sm" variant="ghost" onPress={dl.remove}>
                <Text>{t('routine.removeDownload')}</Text>
              </Button>
            ) : null}
          </View>

          {/* ordered poses by phase */}
          <Text variant="heading">{t('routine.structure')}</Text>
          {grouped.map((g) => (
            <View key={g.phase} className="gap-2">
              <Text variant="caption" className="font-sans-semibold uppercase tracking-wide">
                {t(`routine.phase.${g.phase}`)}
              </Text>
              {g.steps.map((s, i) => {
                const e = getExercise(s.exerciseId);
                return (
                  <Pressable
                    key={`${g.phase}-${i}`}
                    onPress={() => openPose(e.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`${e.name}, ${formatDuration(s.durationSec, t)}`}
                    className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3 active:opacity-90"
                  >
                    <View className="size-14 overflow-hidden rounded-xl">
                      <CoverArt tint="mint" figure={variantFor(e)} height={56} width={56} rounded={12} />
                    </View>
                    <View className="flex-1">
                      <Text variant="label" numberOfLines={1}>
                        {e.name}
                      </Text>
                      {e.altName ? (
                        <Text variant="caption" className="italic" numberOfLines={1}>
                          {e.altName}
                        </Text>
                      ) : null}
                    </View>
                    <Text variant="caption">{formatDuration(s.durationSec, t)}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      <HeroActions favorite={favorites.includes(favKey)} onFavorite={() => toggleFavorite(favKey)} />

      <GlassCard
        strong
        radii={{ tl: 28, tr: 28 }}
        style={{ position: 'absolute', start: 0, end: 0, bottom: 0 }}
        contentStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <Button size="lg" onPress={() => startSession(r.id)}>
          <Text>{t('routine.start')}</Text>
        </Button>
      </GlassCard>
    </View>
  );
}
