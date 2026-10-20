import { router } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import type { ReactNode } from 'react';
import { I18nManager, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora-background';
import { FadeUp } from '@/components/fade-up';
import { GlassCard } from '@/components/glass-card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { safeBack } from '@/lib/nav';

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
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-background">
      <AuroraBackground variant={tint === 'lavender' ? 'evening' : 'day'} />
      <GlassCard radius={22} style={{ position: 'absolute', top: insets.top + 8, start: 12, zIndex: 5 }}>
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 68,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 16,
          gap: 16,
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
