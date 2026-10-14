import { router } from 'expo-router';
import { Leaf } from 'phosphor-react-native';
import { useState } from 'react';
import { ScrollView, Text as RNText, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Character } from '@/characters/character';
import { ConfettiLeaves } from '@/characters/props';
import { AuroraBackground } from '@/components/aurora-background';
import { FadeUp } from '@/components/fade-up';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { OrDivider, SocialButtons } from '@/features/auth/fields';
import { finishAuth } from '@/features/auth/flow';
import { useT } from '@/i18n';
import { signInWithProvider } from '@/lib/auth';
import { usePrefsStore } from '@/store/prefs-store';

/**
 * Account gate — "Save your journey". Shown once after the plan reveal: value first, then the ask.
 * Sign up, sign in, or continue as a guest (everything stays on the device).
 */
export default function GateScreen() {
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const minutes = usePrefsStore((s) => s.minutesPerDay);
  const [busy, setBusy] = useState(false);

  const social = async (provider: 'apple' | 'google') => {
    setBusy(true);
    finishAuth(await signInWithProvider(provider));
  };

  return (
    <View className="flex-1 bg-background">
      <AuroraBackground />
      <ConfettiLeaves width={width} height={height} count={7} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 28,
          paddingHorizontal: 16,
          gap: 16,
        }}
      >
        <FadeUp className="items-center gap-2">
          <Character name="kai" pose="celebrate" mood="happy" size={128} />
          <GlassCard
            radius={16}
            shadow={false}
            contentStyle={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <Icon as={Leaf} size={16} weight="duotone" className="text-primary" />
            <Text variant="caption" className="text-foreground">
              {t('auth.gate.planChip', { minutes })}
            </Text>
          </GlassCard>
        </FadeUp>

        <FadeUp delay={150} className="gap-2 px-2">
          <Text variant="title1" className="text-center">
            {t('auth.gate.title')}
          </Text>
          <Text variant="body" className="text-center text-muted-foreground">
            {t('auth.gate.body')}
          </Text>
        </FadeUp>

        <FadeUp delay={300}>
          <GlassCard strong radius={28} contentStyle={{ padding: 16, gap: 12 }}>
            <Button size="lg" onPress={() => router.push('/sign-up')}>
              <Text>{t('auth.gate.signUp')}</Text>
            </Button>
            <SocialButtons onPress={social} busy={busy} />
            <OrDivider />
            <Button variant="ghost" onPress={() => router.push('/sign-in')}>
              <Text>{t('auth.gate.haveAccount')}</Text>
            </Button>
            <Button variant="secondary" onPress={() => finishAuth()}>
              <Text>{t('auth.gate.guest')}</Text>
            </Button>
            <Text variant="caption" className="text-center">
              {t('auth.gate.guestHint')}
            </Text>
          </GlassCard>
        </FadeUp>

        <FadeUp delay={450} className="px-4">
          <Text variant="caption" className="text-center">
            {t('auth.gate.legal')}{' '}
            <RNText
              onPress={() => router.push('/settings/terms')}
              style={{ textDecorationLine: 'underline' }}
              accessibilityRole="link"
            >
              {t('auth.gate.terms')}
            </RNText>{' '}
            {t('auth.gate.and')}{' '}
            <RNText
              onPress={() => router.push('/settings/privacy')}
              style={{ textDecorationLine: 'underline' }}
              accessibilityRole="link"
            >
              {t('auth.gate.privacy')}
            </RNText>
          </Text>
        </FadeUp>
      </ScrollView>
    </View>
  );
}
