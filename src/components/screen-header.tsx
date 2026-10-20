import { router } from 'expo-router';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import type { ReactNode } from 'react';
import { I18nManager, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { safeBack } from '@/lib/nav';

interface Props {
  title: string;
  subtitle?: string;
  /** Trailing action(s), e.g. an icon button. */
  right?: ReactNode;
  onBack?: () => void;
}

/** Back button + big serif title. Used by every pushed screen that has no hero image. */
export function ScreenHeader({ title, subtitle, right, onBack }: Props) {
  const { t } = useT();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + 4 }} className="gap-2 px-2 pb-2">
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={onBack ?? (() => safeBack())}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          className="size-12 items-center justify-center rounded-full active:bg-secondary"
        >
          <Icon as={I18nManager.isRTL ? CaretRight : CaretLeft} size={24} className="text-foreground" />
        </Pressable>
        {right}
      </View>
      <View className="gap-1 px-2">
        <Text variant="title1" accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="body" className="text-muted-foreground">
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
