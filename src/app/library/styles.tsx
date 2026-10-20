import { View } from 'react-native';

import { CategoryCard } from '@/components/category-card';
import { FadeUp } from '@/components/fade-up';
import { Text } from '@/components/ui/text';
import { listStyles } from '@/data/repo';
import type { StyleId } from '@/data/types';
import { CollectionScaffold } from '@/features/library/collection-scaffold';
import { useT } from '@/i18n';
import { openCollection } from '@/lib/nav';
import { useTheme } from '@/theme/theme-provider';

/** The eight styles most people ask about, in the order they appear; everything else sits under "More". */
const MAIN: StyleId[] = ['hatha', 'vinyasa', 'yin', 'restorative', 'power', 'gentle', 'chair', 'prenatal'];

/** Yoga styles: every style as a card with a plain-language explainer, opening that style's routines. */
export default function StylesScreen() {
  const { t } = useT();
  const { colors } = useTheme();
  const all = listStyles();
  const main = MAIN.map((id) => all.find((s) => s.id === id)).filter((s): s is NonNullable<typeof s> => !!s);
  const more = all.filter((s) => !MAIN.includes(s.id));

  const list = (items: typeof all, base = 0) => (
    <View style={{ gap: 12 }}>
      {items.map((s, i) => (
        <FadeUp key={s.id} delay={base + i * 50} distance={14}>
          <CategoryCard style={s} onPress={() => openCollection('style', s.id)} />
        </FadeUp>
      ))}
    </View>
  );

  return (
    <CollectionScaffold title={t('stylesScreen.title')} subtitle={t('stylesScreen.subtitle')}>
      {list(main)}
      {more.length ? (
        <View style={{ gap: 12, paddingTop: 8 }}>
          <Text variant="title2" style={{ color: colors.forest }}>
            {t('stylesScreen.more')}
          </Text>
          {list(more, 400)}
        </View>
      ) : null}
    </CollectionScaffold>
  );
}
