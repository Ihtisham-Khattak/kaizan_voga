import { router, type Href } from 'expo-router';
import { Check, Minus, X } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Character } from '@/characters/character';
import { AuroraBackground } from '@/components/aurora-background';
import { GlassCard } from '@/components/glass-card';
import { toast } from '@/components/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { CheckoutSheet } from '@/features/premium/checkout-sheet';
import { COMPARISON, PRICE_KEY, type PaidPlan } from '@/features/premium/plans';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { useHasPremium, useSubscriptionStore } from '@/store/subscription-store';

const go = (href: string) => () => router.push(href as Href);

function Mark({ included, label }: { included: boolean; label: string }) {
  return (
    <View accessible accessibilityLabel={label} className="w-[76px] items-center">
      {included ? (
        <View className="size-6 items-center justify-center rounded-full bg-leaf">
          <Icon as={Check} size={14} weight="bold" className="text-onLeaf" />
        </View>
      ) : (
        <Icon as={Minus} size={18} className="text-muted-foreground" />
      )}
    </View>
  );
}

function PlanCard({ plan, selected, onPress }: { plan: PaidPlan; selected: boolean; onPress: () => void }) {
  const { t } = useT();
  return (
    <Pressable
      role="radio"
      aria-checked={selected}
      accessibilityLabel={`${t(`premium.paywall.${plan}`)}, ${t(`premium.paywall.${PRICE_KEY[plan]}`)}${plan === 'yearly' ? `, ${t('premium.paywall.bestValue')}, ${t('premium.paywall.save')}` : ''}`}
      accessibilityState={{ checked: selected }}
      onPress={() => {
        haptic.select();
        onPress();
      }}
      className={cn(
        'flex-1 gap-2 rounded-card border-2 bg-bg p-4',
        selected ? 'border-primary' : 'border-hairline'
      )}
    >
      <View className="min-h-6 flex-row flex-wrap gap-1">
        {plan === 'yearly' ? (
          <>
            <Badge variant="default">
              <Text>{t('premium.paywall.bestValue')}</Text>
            </Badge>
          </>
        ) : null}
      </View>
      <Text variant="title3">{t(`premium.paywall.${plan}`)}</Text>
      <Text variant="body">{t(`premium.paywall.${PRICE_KEY[plan]}`)}</Text>
      {plan === 'yearly' ? (
        <Text variant="footnote" className="font-sans-bold text-primary">
          {t('premium.paywall.save')}
        </Text>
      ) : (
        <Text variant="footnote"> </Text>
      )}
    </Pressable>
  );
}

/** Premium / paywall (M-01). Calm comparison, two plan cards, a mock trial. Nothing here is a real purchase. */
export default function PremiumScreen() {
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const premium = useHasPremium();
  const restore = useSubscriptionStore((s) => s.restore);
  const [plan, setPlan] = useState<PaidPlan>('yearly');
  const [trial, setTrial] = useState(true);
  const [checkout, setCheckout] = useState(false);

  const doRestore = () =>
    toast.info(restore() ? t('premium.paywall.restored') : t('premium.paywall.nothingToRestore'));

  return (
    <View className="flex-1 bg-background">
      <AuroraBackground />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: premium ? insets.bottom + 40 : 170,
          paddingHorizontal: 16,
          gap: 20,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="rounded-pill border border-hairline bg-sunriseSoft px-3 py-1.5">
            <Text variant="footnote" className="text-sunriseInk">
              {t('common.prototype')}
            </Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel={t('premium.paywall.close')}
            className="size-11 items-center justify-center rounded-full bg-bg/80"
          >
            <Icon as={X} size={20} weight="bold" />
          </Pressable>
        </View>

        <View className="items-center gap-2">
          <Character name="kai" pose="float" mood="happy" size={120} />
          <Text variant="title1" className="text-center" accessibilityRole="header">
            {t('premium.paywall.title')}
          </Text>
          <Text variant="bodyLarge" className="text-center text-muted-foreground">
            {t('premium.paywall.subtitle')}
          </Text>
        </View>

        <GlassCard strong style={{ width: '100%' }} contentStyle={{ padding: 16, gap: 4 }}>
          <View className="flex-row items-center pb-2" accessibilityLabel={t('premium.paywall.table')}>
            <View className="flex-1" />
            <Text variant="overline" className="w-[76px] text-center">
              {t('premium.paywall.free')}
            </Text>
            <Text variant="overline" className="w-[76px] text-center text-primary">
              {t('premium.paywall.premium')}
            </Text>
          </View>
          {COMPARISON.map(([key, free], i) => {
            const label = t(`premium.paywall.rows.${key}`);
            const yes = t('premium.paywall.included');
            const no = t('premium.paywall.notIncluded');
            return (
              <View
                key={key}
                accessible
                accessibilityLabel={`${label}. ${t('premium.paywall.free')}: ${free ? yes : no}. ${t('premium.paywall.premium')}: ${yes}`}
                className={cn('min-h-12 flex-row items-center py-2', i > 0 && 'border-hairline border-t')}
              >
                <Text variant="body" className="flex-1 pe-2">
                  {label}
                </Text>
                <Mark included={free} label={free ? yes : no} />
                <Mark included label={yes} />
              </View>
            );
          })}
        </GlassCard>

        {premium ? (
          <GlassCard strong style={{ width: '100%' }} contentStyle={{ padding: 16, gap: 8 }}>
            <Text variant="title3">{t('premium.paywall.youHave')}</Text>
            <Text variant="body" className="text-muted-foreground">
              {t('premium.paywall.youHaveBody')}
            </Text>
            <Button onPress={go('/settings/subscription')}>
              <Text>{t('premium.paywall.manage')}</Text>
            </Button>
          </GlassCard>
        ) : (
          <View className="gap-3">
            <Text variant="title2" accessibilityRole="header">
              {t('premium.paywall.plans')}
            </Text>
            <View role="radiogroup" className="flex-row gap-3">
              <PlanCard plan="monthly" selected={plan === 'monthly'} onPress={() => setPlan('monthly')} />
              <PlanCard plan="yearly" selected={plan === 'yearly'} onPress={() => setPlan('yearly')} />
            </View>
            <Pressable
              role="switch"
              aria-checked={trial}
              accessibilityLabel={`${t('premium.paywall.trial')}. ${t('premium.paywall.trialSub', { price: t(`premium.paywall.${PRICE_KEY[plan]}`) })}`}
              accessibilityState={{ checked: trial }}
              onPress={() => setTrial((v) => !v)}
              className="min-h-14 flex-row items-center gap-3 rounded-card border border-hairline bg-bg p-4"
            >
              <View className="flex-1">
                <Text variant="callout">{t('premium.paywall.trial')}</Text>
                <Text variant="footnote">
                  {t('premium.paywall.trialSub', { price: t(`premium.paywall.${PRICE_KEY[plan]}`) })}
                </Text>
              </View>
              <View pointerEvents="none">
                <Switch
                  checked={trial}
                  onCheckedChange={() => {}}
                  accessibilityLabel={t('premium.paywall.trial')}
                />
              </View>
            </Pressable>
          </View>
        )}

        <View className="items-center gap-2">
          <View className="flex-row flex-wrap items-center justify-center gap-x-4">
            <Pressable onPress={doRestore} accessibilityRole="button" className="min-h-11 justify-center">
              <Text variant="callout" className="text-primary underline">
                {t('premium.paywall.restore')}
              </Text>
            </Pressable>
            <Pressable
              onPress={go('/settings/terms')}
              accessibilityRole="button"
              className="min-h-11 justify-center"
            >
              <Text variant="callout" className="text-primary underline">
                {t('premium.paywall.terms')}
              </Text>
            </Pressable>
            <Pressable
              onPress={go('/settings/terms')}
              accessibilityRole="button"
              className="min-h-11 justify-center"
            >
              <Text variant="callout" className="text-primary underline">
                {t('premium.paywall.privacy')}
              </Text>
            </Pressable>
          </View>
          <Pressable
            onPress={go('/premium/help-affording')}
            accessibilityRole="button"
            className="min-h-11 justify-center"
          >
            <Text variant="callout" className="text-center text-primary underline">
              {t('premium.paywall.help')}
            </Text>
          </Pressable>
          <Text variant="footnote" className="text-center">
            {t('premium.paywall.cancelAnytime')}
          </Text>
        </View>
      </ScrollView>

      {premium ? null : (
        <GlassCard
          strong
          radii={{ tl: 28, tr: 28 }}
          shadow={false}
          style={{ position: 'absolute', start: 0, end: 0, bottom: 0 }}
          contentStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <Button size="lg" onPress={() => setCheckout(true)}>
            <Text>{trial ? t('premium.paywall.ctaTrial') : t('premium.paywall.ctaContinue')}</Text>
          </Button>
        </GlassCard>
      )}

      <CheckoutSheet visible={checkout} onClose={() => setCheckout(false)} plan={plan} trial={trial} />
    </View>
  );
}
