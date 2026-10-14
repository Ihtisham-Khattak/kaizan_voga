import { router } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import type { ReactNode } from 'react';
import { I18nManager, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SceneBackground } from '@/characters/props';
import { FadeUp } from '@/components/fade-up';
import { GlassCard } from '@/components/glass-card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { useTheme } from '@/theme/theme-provider';

/** Shared layout for stack screens that list things: soft backdrop, glass back button, big title, scrolling body. */
export function CollectionScaffold({
  title,
  subtitle,
  tint = 'mint',
  children,
}: {
  title: string;
  subtitle?: string;
  tint?: 'mint' | 'lavender' | 'sand';
  children: ReactNode;
}) {
  const { t } = useT();
  const { scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const light = {
    mint: ['#D6EBDC', '#FAF6EE'],
    lavender: ['#E9E3F6', '#FAF6EE'],
    sand: ['#F4E6CB', '#FAF6EE'],
  }[tint] as [string, string];
  return (
    <View className="flex-1 bg-background">
      <SceneBackground colors={scheme === 'dark' ? ['#183025', '#121A16'] : light} />
      <GlassCard radius={22} style={{ position: 'absolute', top: insets.top + 8, start: 12, zIndex: 5 }}>
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 68,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 16,
          gap: 14,
        }}
      >
        <FadeUp className="gap-1 pb-2">
          <Text variant="title1" accessibilityRole="header">
            {title}
          </Text>
          {subtitle ? (
            <Text variant="body" className="text-muted-foreground">
              {subtitle}
            </Text>
          ) : null}
        </FadeUp>
        {children}
      </ScrollView>
    </View>
  );
}
