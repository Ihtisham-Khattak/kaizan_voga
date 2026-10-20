import { router, useLocalSearchParams } from 'expo-router';
import { CaretLeft, MagnifyingGlass, Sliders, X } from 'phosphor-react-native';
import { useMemo, useState } from 'react';
import { I18nManager, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheet } from '@/components/bottom-sheet';
import { EmptyFor } from '@/features/states/empty';
import { ExerciseCard } from '@/components/exercise-card';
import { GlassCard } from '@/components/glass-card';
import { RoutineCard } from '@/components/routine-card';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { search, type ExerciseCategory, type Level, type Position, type SearchFilters } from '@/data/repo';
import { useT } from '@/i18n';
import { openPose, openRoutine, safeBack } from '@/lib/nav';
import { useLibraryStore } from '@/store/library-store';
import type { Equipment, Goal } from '@/store/types';
import { useTheme } from '@/theme/theme-provider';
import { families, typography } from '@/theme/typography';

const CATEGORIES: ExerciseCategory[] = [
  'standing',
  'seated',
  'balance',
  'floor',
  'prone',
  'mobility',
  'restorative',
  'flows',
  'breathing',
  'chair',
];
const GOALS: Goal[] = ['stress', 'back-neck', 'sleep', 'focus', 'flexibility', 'balance', 'gentle'];
const POSITIONS: Position[] = ['seated', 'standing', 'floor', 'prone', 'supine', 'kneeling'];
const EQUIPMENT: Equipment[] = ['mat', 'chair', 'blocks', 'strap', 'cushion'];
const DURATIONS = [300, 600, 900, 1200];

type Filters = Omit<SearchFilters, 'query'>;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Text variant="label">{title}</Text>
      <View className="flex-row flex-wrap gap-2">{children}</View>
    </View>
  );
}

/** Search: debounce-free instant results across poses + routines, recent searches, removable filter chips, filter sheet. */
export default function SearchScreen() {
  const { t } = useT();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ filter?: string }>();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [sheet, setSheet] = useState(!!params.filter);
  const { recentSearches, addRecentSearch, clearRecentSearches, favorites, toggleFavorite } =
    useLibraryStore();

  const active = useMemo(() => {
    const out: { key: keyof Filters; label: string }[] = [];
    if (filters.category) out.push({ key: 'category', label: t(`explore.categoryName.${filters.category}`) });
    if (filters.level) out.push({ key: 'level', label: t(`level.${filters.level}`) });
    if (filters.maxSec) out.push({ key: 'maxSec', label: t('search.upTo', { count: filters.maxSec / 60 }) });
    if (filters.goal) out.push({ key: 'goal', label: t(`goal.${filters.goal}`) });
    if (filters.position) out.push({ key: 'position', label: t(`explore.positionName.${filters.position}`) });
    if (filters.equipment)
      out.push({ key: 'equipment', label: t(`onboardingQ.equipment.${filters.equipment}`) });
    if (filters.chairFriendly) out.push({ key: 'chairFriendly', label: t('explore.chair') });
    return out;
  }, [filters, t]);

  const hasInput = query.trim().length > 0 || active.length > 0;
  const results = useMemo(
    () => (hasInput ? search({ query, ...filters }) : { exercises: [], routines: [] }),
    [hasInput, query, filters]
  );
  const total = results.exercises.length + results.routines.length;

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((f) => ({ ...f, [key]: f[key] === value ? undefined : value }));

  return (
    <View className="flex-1 bg-background">
      <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center gap-2 px-3 pb-2">
        <GlassCard radius="pill" shadow={false}>
          <Pressable
            onPress={() => safeBack()}
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
        <View className="min-h-[46px] flex-1 flex-row items-center gap-2 rounded-full border border-border bg-card px-4">
          <Icon as={MagnifyingGlass} size={18} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => addRecentSearch(query)}
            placeholder={t('search.placeholder')}
            placeholderTextColor={colors.muted}
            autoFocus
            returnKeyType="search"
            accessibilityLabel={t('search.placeholder')}
            style={
              {
                flex: 1,
                fontSize: typography.body.size,
                fontFamily: families.sans['400'],
                color: colors.ink,
                paddingVertical: 8,
                outlineStyle: 'none',
              } as never
            }
          />
          {query ? (
            <Pressable
              onPress={() => setQuery('')}
              accessibilityRole="button"
              accessibilityLabel={t('search.clear')}
              className="size-8 items-center justify-center"
            >
              <Icon as={X} size={16} weight="bold" />
            </Pressable>
          ) : null}
        </View>
        <GlassCard radius="pill" shadow={false}>
          <Pressable
            onPress={() => setSheet(true)}
            accessibilityRole="button"
            accessibilityLabel={`${t('search.filters')} ${active.length || ''}`}
            className="size-11 items-center justify-center"
          >
            <Icon as={Sliders} size={20} />
            {active.length ? (
              <View className="absolute end-1 top-1 size-4 items-center justify-center rounded-full bg-primary">
                <Text variant="caption" className="font-sans-bold text-onLeaf">
                  {active.length}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </GlassCard>
      </View>

      {active.length ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 12, paddingVertical: 8 }}
          style={{ flexGrow: 0 }}
        >
          {active.map((a) => (
            <Chip
              key={a.key}
              selected
              label={a.label}
              accessibilityLabel={t('search.removeFilter', { name: a.label })}
              onPress={() => setFilters((f) => ({ ...f, [a.key]: undefined }))}
            />
          ))}
          <Chip label={t('search.reset')} onPress={() => setFilters({})} />
        </ScrollView>
      ) : null}

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32, gap: 16 }}
      >
        {!hasInput ? (
          <>
            {recentSearches.length ? (
              <View className="gap-2">
                <View className="flex-row items-center justify-between">
                  <Text variant="heading">{t('search.recent')}</Text>
                  <Pressable
                    onPress={clearRecentSearches}
                    accessibilityRole="button"
                    className="min-h-11 justify-center"
                  >
                    <Text variant="label" className="text-primary">
                      {t('search.clear')}
                    </Text>
                  </Pressable>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {recentSearches.map((q) => (
                    <Chip key={q} label={q} onPress={() => setQuery(q)} />
                  ))}
                </View>
              </View>
            ) : null}
            <View className="gap-2">
              <Text variant="heading">{t('explore.byGoal')}</Text>
              <View className="flex-row flex-wrap gap-2">
                {GOALS.map((g) => (
                  <Chip key={g} label={t(`goal.${g}`)} onPress={() => setFilters({ goal: g })} />
                ))}
              </View>
            </View>
          </>
        ) : total === 0 ? (
          <EmptyFor kind="search" />
        ) : (
          <>
            <Text variant="caption" accessibilityLiveRegion="polite">
              {t('search.resultsCount', { count: total })}
            </Text>
            {results.exercises.length ? (
              <View className="gap-3">
                <Text variant="heading">{t('search.poses')}</Text>
                {results.exercises.map((e) => (
                  <ExerciseCard
                    key={e.id}
                    exercise={e}
                    isFavorite={favorites.includes(`exercise:${e.id}`)}
                    onFavorite={() => toggleFavorite(`exercise:${e.id}`)}
                    onPress={() => {
                      addRecentSearch(query);
                      openPose(e.id);
                    }}
                  />
                ))}
              </View>
            ) : null}
            {results.routines.length ? (
              <View className="gap-3">
                <Text variant="heading">{t('search.routines')}</Text>
                {results.routines.map((r) => (
                  <RoutineCard
                    key={r.id}
                    variant="row"
                    routine={r}
                    onPress={() => {
                      addRecentSearch(query);
                      openRoutine(r.id);
                    }}
                  />
                ))}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>

      <BottomSheet
        visible={sheet}
        onClose={() => setSheet(false)}
        title={t('search.filters')}
        snapPoints={['88%']}
        scrollable
      >
        <Section title={t('explore.category')}>
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={t(`explore.categoryName.${c}`)}
              selected={filters.category === c}
              onPress={() => set('category', c)}
            />
          ))}
        </Section>
        <Section title={t('explore.level')}>
          {(['beginner', 'intermediate'] as Level[]).map((l) => (
            <Chip
              key={l}
              label={t(`level.${l}`)}
              selected={filters.level === l}
              onPress={() => set('level', l)}
            />
          ))}
        </Section>
        <Section title={t('explore.duration')}>
          {DURATIONS.map((d) => (
            <Chip
              key={d}
              label={t('search.upTo', { count: d / 60 })}
              selected={filters.maxSec === d}
              onPress={() => set('maxSec', d)}
            />
          ))}
        </Section>
        <Section title={t('explore.goal')}>
          {GOALS.map((g) => (
            <Chip
              key={g}
              label={t(`goal.${g}`)}
              selected={filters.goal === g}
              onPress={() => set('goal', g)}
            />
          ))}
        </Section>
        <Section title={t('explore.position')}>
          {POSITIONS.map((p) => (
            <Chip
              key={p}
              label={t(`explore.positionName.${p}`)}
              selected={filters.position === p}
              onPress={() => set('position', p)}
            />
          ))}
        </Section>
        <Section title={t('explore.equipment')}>
          {EQUIPMENT.map((e) => (
            <Chip
              key={e}
              label={t(`onboardingQ.equipment.${e}`)}
              selected={filters.equipment === e}
              onPress={() => set('equipment', e)}
            />
          ))}
        </Section>
        <View className="flex-row items-center justify-between gap-3">
          <Text variant="label">{t('explore.chair')}</Text>
          <Switch
            checked={!!filters.chairFriendly}
            onCheckedChange={(v) => setFilters((f) => ({ ...f, chairFriendly: v || undefined }))}
            accessibilityLabel={t('explore.chair')}
          />
        </View>
        <View className="flex-row gap-3 pt-1">
          <Button variant="outline" className="flex-1" onPress={() => setFilters({})}>
            <Text>{t('search.reset')}</Text>
          </Button>
          <Button className="flex-1" onPress={() => setSheet(false)}>
            <Text>{t('search.show')}</Text>
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
}
