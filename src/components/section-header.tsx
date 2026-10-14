import { CaretRight } from 'phosphor-react-native';
import { I18nManager, Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';

interface Props {
  title: string;
  /** When provided, a "See all" link is shown. */
  onSeeAll?: () => void;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle, onSeeAll }: Props) {
  const { t } = useT();
  return (
    <View className="flex-row items-end justify-between gap-3 px-4">
      <View className="flex-1 gap-1">
        <Text variant="title" accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? <Text variant="caption">{subtitle}</Text> : null}
      </View>
      {onSeeAll ? (
        <Pressable
          onPress={onSeeAll}
          accessibilityRole="link"
          accessibilityLabel={`${t('common.seeAll')}: ${title}`}
          className="min-h-11 flex-row items-center gap-1"
        >
          <Text variant="label" className="text-primary">
            {t('common.seeAll')}
          </Text>
          <Icon
            as={CaretRight}
            size={16}
            weight="bold"
            className="text-primary"
            style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
          />
        </Pressable>
      ) : null}
    </View>
  );
}
