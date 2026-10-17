import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { FadeUp } from '@/components/fade-up';
import { ProgramCard } from '@/components/program-card';
import { Chip } from '@/components/ui/chip';
import { Text } from '@/components/ui/text';
import { listPrograms } from '@/data/repo';
import type { ProgramTheme } from '@/data/types';
import { CollectionScaffold } from '@/features/library/collection-scaffold';
import { useT } from '@/i18n';
import { openProgram } from '@/lib/nav';
import { useTheme } from '@/theme/theme-provider';

const THEMES: (ProgramTheme | 'all')[] = [
  'all',
  'beginners',
  'flexibility',
  'stress',
  'sleep',
  'strength',
  'mobility',
];

/** Programs: curated multi-week plans, filtered by what you want from them. Rest days are part of every plan. */
export default function ProgramsScreen() {
  const { t } = useT();
  const { colors } = useTheme();
  const [theme, setTheme] = useState<ProgramTheme | 'all'>('all');
  const all = listPrograms();
  const list = theme === 'all' ? all : all.filter((p) => p.theme === theme);
  const [featured, ...rest] = list;

  return (
    <CollectionScaffold title={t('programsScreen.title')} subtitle={t('programsScreen.subtitle')}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingEnd: 16 }}
        style={{ marginHorizontal: -16 }}
        role="radiogroup"
      >
        <View style={{ width: 8 }} />
        {THEMES.map((id) => (
          <Chip
            key={id}
            label={t(`programsScreen.themes.${id}`)}
            selected={theme === id}
            onPress={() => setTheme(id)}
          />
        ))}
      </ScrollView>

      {featured ? (
        <>
          <FadeUp key={`f-${theme}`} style={{ gap: 8 }}>
            <Text variant="overline" style={{ color: colors.muted }}>
              {t('programsScreen.featured')}
            </Text>
            <ProgramCard program={featured} onPress={() => openProgram(featured.id)} />
          </FadeUp>
          {rest.length ? (
            <View style={{ gap: 12 }}>
              <Text variant="title2" style={{ color: colors.forest }}>
                {t('programsScreen.all')}
              </Text>
              {rest.map((p, i) => (
                <FadeUp key={p.id} delay={80 + i * 60} distance={14}>
                  <ProgramCard program={p} onPress={() => openProgram(p.id)} />
                </FadeUp>
              ))}
            </View>
          ) : null}
        </>
      ) : (
        <EmptyState title={t('programsScreen.emptyTitle')} body={t('programsScreen.emptyBody')} />
      )}
    </CollectionScaffold>
  );
}
