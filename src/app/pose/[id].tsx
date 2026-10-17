import { router, useLocalSearchParams } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import { CaretLeft, Heart, Leaf, Plus, ShareNetwork, ShieldCheck } from 'phosphor-react-native';
import { useState } from 'react';
import { I18nManager, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora-background';
import { CoverArt, variantFor } from '@/components/cover-art';
import { hasPoseVideo, PoseMedia } from '@/components/pose-media';
import { EmptyState } from '@/components/empty-state';
import { GlassCard } from '@/components/glass-card';
import { SafetyNotice } from '@/components/safety-notice';
import { toast } from '@/components/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { getExercise, type Modification } from '@/data/repo';
import { AddToRoutineSheet } from '@/features/pose/add-to-routine-sheet';
import { DetailSkeleton } from '@/features/states/skeletons';
import { useScreenLoading } from '@/hooks/use-screen-loading';
import { useT } from '@/i18n';
import { formatDuration } from '@/lib/format';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { useLibraryStore } from '@/store/library-store';

type Tab = 'steps' | 'breathing' | 'setup' | 'mistakes' | 'mods' | 'cautions';
const TABS: Tab[] = ['steps', 'breathing', 'setup', 'mistakes', 'mods', 'cautions'];

function Numbered({ items }: { items: string[] }) {
  return (
    <View className="gap-3">
      {items.map((s, i) => (
        <View key={s} className="flex-row items-start gap-3">
          <View className="size-7 items-center justify-center rounded-full bg-primary">
            <Text variant="caption" className="font-sans-bold text-primary-foreground">
              {String(i + 1)}
            </Text>
          </View>
          <Text variant="body" className="flex-1">
            {s}
          </Text>
        </View>
      ))}
    </View>
  );
}

/** Pose detail: big illustration, names, chips, soft caution, tabbed guidance, modifications that swap the figure, trust badge. */
export default function PoseDetail() {
  const { t } = useT();
  const loading = useScreenLoading();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const e = getExercise(String(id));
  const favorites = useLibraryStore((s) => s.favorites);
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const [tab, setTab] = useState<Tab>('steps');
  const [mod, setMod] = useState<Modification | null>(null);
  const [sheet, setSheet] = useState(false);

  if (!e) {
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

  const favKey = `exercise:${e.id}`;
  const isFav = favorites.includes(favKey);
  const figure = mod?.kind === 'chair' ? 'seated' : variantFor(e);
  const duration = formatDuration(e.durationSec, t);

  if (loading) return <DetailSkeleton />;

  return (
    <View className="flex-1 bg-background">
      <AuroraBackground />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* hero: the pose clip when there is one, otherwise the illustration */}
        <View style={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden' }}>
          <PoseMedia
            exercise={e}
            height={300}
            fallback={
              <CoverArt
                tint="mint"
                figure={figure}
                height={300}
                rounded={0}
                figureSize={190}
                figureShift={-6}
              />
            }
          />
          {hasPoseVideo(e) ? null : (
            <View style={{ position: 'absolute', bottom: 12, alignSelf: 'center' }}>
              <GlassCard
                radius={14}
                shadow={false}
                contentStyle={{ paddingHorizontal: 12, paddingVertical: 4 }}
              >
                <Text variant="caption">{t('pose.placeholder')}</Text>
              </GlassCard>
            </View>
          )}
        </View>

        <View className="gap-4 px-4 pt-6">
          <View className="gap-1">
            <Text variant="title1" accessibilityRole="header">
              {e.name}
            </Text>
            {e.altName ? (
              <Text variant="lead" className="italic text-muted-foreground">
                {e.altName}
              </Text>
            ) : null}
          </View>
          <View className="flex-row flex-wrap gap-2">
            <Badge variant="secondary">
              <Text>{t(`explore.categoryName.${e.category}`)}</Text>
            </Badge>
            <Badge variant="outline">
              <Text>{t(`level.${e.level}`)}</Text>
            </Badge>
            <Badge variant="secondary">
              <Text>{duration}</Text>
            </Badge>
            {e.side === 'both' ? (
              <Badge variant="lavender">
                <Text>{t('pose.bothSides')}</Text>
              </Badge>
            ) : null}
          </View>

          <SafetyNotice title={t('safety.title')} lines={[e.cautions[0] ?? t('pose.stopHint')]} />

          {/* section tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
            role="tablist"
          >
            {TABS.map((k) => (
              <Chip key={k} label={t(`pose.tabs.${k}`)} selected={tab === k} onPress={() => setTab(k)} />
            ))}
          </ScrollView>

          <AnimatePresence exitBeforeEnter>
            <MotiView
              key={tab}
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'timing', duration: 250 }}
              style={{ gap: 12, minHeight: 120 }}
            >
              {tab === 'steps' ? <Numbered items={mod ? [mod.text, ...e.steps] : e.steps} /> : null}
              {tab === 'breathing'
                ? e.breathingCues.map((c) => (
                    <View key={c} className="flex-row items-center gap-3 rounded-2xl bg-secondary px-4 py-3">
                      <Icon as={Leaf} size={20} weight="duotone" className="text-primary" />
                      <Text variant="body" className="flex-1">
                        {c}
                      </Text>
                    </View>
                  ))
                : null}
              {tab === 'setup' ? (
                <>
                  <View className="gap-1 rounded-card border border-border bg-card p-4">
                    <Text variant="label">{t('pose.setup')}</Text>
                    <Text variant="body">{e.setup}</Text>
                  </View>
                  <View className="gap-1 rounded-card border border-border bg-card p-4">
                    <Text variant="label">{t('pose.safeExit')}</Text>
                    <Text variant="body">{e.safeExit}</Text>
                  </View>
                </>
              ) : null}
              {tab === 'mistakes'
                ? e.commonMistakes.map((m) => (
                    <View key={m} className="flex-row items-start gap-3">
                      <View className="mt-2 size-2 rounded-full bg-leaf" />
                      <Text variant="body" className="flex-1">
                        {m}
                      </Text>
                    </View>
                  ))
                : null}
              {tab === 'mods' ? (
                <>
                  <View className="flex-row flex-wrap gap-2">
                    <Chip label={t('pose.original')} selected={!mod} onPress={() => setMod(null)} />
                    {e.modifications.map((m) => (
                      <Chip
                        key={m.title}
                        label={t(`pose.modKind.${m.kind}`)}
                        selected={mod?.title === m.title}
                        onPress={() => setMod(m)}
                      />
                    ))}
                  </View>
                  {mod ? (
                    <View className="gap-1 rounded-card bg-secondary p-4">
                      <Text variant="label">{mod.title}</Text>
                      <Text variant="body">{mod.text}</Text>
                    </View>
                  ) : null}
                </>
              ) : null}
              {tab === 'cautions' ? <SafetyNotice title={t('safety.title')} lines={e.cautions} /> : null}
            </MotiView>
          </AnimatePresence>

          {/* props + tags */}
          <View className="gap-2">
            <Text variant="heading">{t('pose.props')}</Text>
            <View className="flex-row flex-wrap gap-2">
              {e.props.length ? (
                e.props.map((p) => (
                  <Badge key={p} variant="secondary">
                    <Text>{p}</Text>
                  </Badge>
                ))
              ) : (
                <Text variant="caption">{t('pose.noProps')}</Text>
              )}
            </View>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {[
              ...e.tags.goal.map((g) => t(`goal.${g}`)),
              e.tags.intensity,
              t(`explore.positionName.${e.tags.position}`),
            ].map((tag) => (
              <Badge key={tag} variant="outline">
                <Text>{tag}</Text>
              </Badge>
            ))}
          </View>

          {/* trust badge */}
          <View className="flex-row items-center gap-2">
            <Icon as={ShieldCheck} size={18} weight="duotone" className="text-primary" />
            <Text variant="caption" className="flex-1">
              {t('pose.reviewed', { name: e.review.name, role: e.review.role, date: e.review.date })}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* floating glass buttons */}
      <GlassCard radius="pill" style={{ position: 'absolute', top: insets.top + 8, start: 12 }}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('a11y.goBack')}
          className="size-11 items-center justify-center"
        >
          <Icon
            as={CaretLeft}
            size={20}
            weight="bold"
            style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
          />
        </Pressable>
      </GlassCard>

      {/* action bar */}
      <GlassCard
        strong
        radii={{ tl: 28, tr: 28 }}
        style={{ position: 'absolute', start: 0, end: 0, bottom: 0 }}
        contentStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 12),
        }}
      >
        <Pressable
          onPress={() => {
            haptic.select();
            toggleFavorite(favKey);
            if (!isFav) toast.success(t('pose.favorite'));
          }}
          accessibilityRole="button"
          accessibilityLabel={isFav ? t('a11y.unfavorite') : t('a11y.favorite')}
          accessibilityState={{ selected: isFav }}
          className="size-12 items-center justify-center rounded-full bg-secondary"
        >
          <Icon
            as={Heart}
            size={22}
            weight={isFav ? 'fill' : 'regular'}
            className={cn(isFav ? 'text-primary' : 'text-foreground')}
          />
        </Pressable>
        <Pressable
          onPress={() => toast.info(t('pose.shareToast'))}
          accessibilityRole="button"
          accessibilityLabel={t('pose.share')}
          className="size-12 items-center justify-center rounded-full bg-secondary"
        >
          <Icon as={ShareNetwork} size={22} className="text-primary" />
        </Pressable>
        <Button className="flex-1" onPress={() => setSheet(true)}>
          <Icon as={Plus} size={18} weight="bold" className="text-primary-foreground" />
          <Text>{t('pose.addToRoutine')}</Text>
        </Button>
      </GlassCard>
      <AddToRoutineSheet visible={sheet} onClose={() => setSheet(false)} exerciseId={e.id} />
    </View>
  );
}
