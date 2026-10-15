import { router, type Href } from 'expo-router';
import { Check } from 'phosphor-react-native';
import { MotiView } from 'moti';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Character } from '@/characters/character';
import { ConfettiLeaves, LightRays } from '@/characters/props';
import { AuroraBackground } from '@/components/aurora-background';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { UNLOCKED } from '@/features/premium/plans';
import { useT } from '@/i18n';

/** Purchase success (M-02): Kai celebrates, leaves fall, and a calm list of what is now available. */
export default function PremiumSuccess() {
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  return (
    <View className="flex-1 bg-background">
      <AuroraBackground />
      <LightRays width={width} height={320} />
      <ConfettiLeaves width={width} height={420} />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: 140,
          paddingHorizontal: 16,
          gap: 16,
          alignItems: 'center',
        }}
      >
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 600 }}
        >
          <Character name="kai" pose="celebrate" mood="happy" size={170} />
        </MotiView>
        <View className="items-center gap-1">
          <Text variant="display" className="text-center" accessibilityRole="header">
            {t('premium.checkout.successTitle')}
          </Text>
          <Text variant="bodyLarge" className="text-center text-muted-foreground">
            {t('premium.checkout.successBody')}
          </Text>
        </View>
        <GlassCard strong style={{ width: '100%' }} contentStyle={{ padding: 16, gap: 12 }}>
          <Text variant="title3" accessibilityRole="header">
            {t('premium.checkout.unlocked')}
          </Text>
          {UNLOCKED.map((k) => (
            <View key={k} className="flex-row items-center gap-3">
              <View className="size-6 items-center justify-center rounded-full bg-leaf">
                <Icon as={Check} size={14} weight="bold" className="text-onLeaf" />
              </View>
              <Text variant="body" className="flex-1">
                {t(`premium.paywall.rows.${k}`)}
              </Text>
            </View>
          ))}
        </GlassCard>
      </ScrollView>
      <GlassCard
        strong
        radii={{ tl: 28, tr: 28 }}
        shadow={false}
        style={{ position: 'absolute', start: 0, end: 0, bottom: 0 }}
        contentStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button size="lg" onPress={() => router.replace('/home' as Href)}>
          <Text>{t('premium.checkout.start')}</Text>
        </Button>
      </GlassCard>
    </View>
  );
}
