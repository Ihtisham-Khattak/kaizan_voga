import { router, type Href } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { Character } from '@/characters/character';
import { BottomSheet } from '@/components/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { useSubscriptionStore } from '@/store/subscription-store';

import { PRICE_KEY, type PaidPlan } from './plans';

type Step = 'review' | 'loading' | 'failed' | 'cancelled';

interface Props {
  visible: boolean;
  onClose: () => void;
  plan: PaidPlan;
  trial: boolean;
}

/**
 * Mock checkout (M-02). Review → loading → success screen, with failure and cancelled states.
 * In dev builds a chip picks the outcome so every state can be reviewed. Real purchases are FN-08.
 */
export function CheckoutSheet({ visible, onClose, plan, trial }: Props) {
  const { t, i18n } = useT();
  const subscribe = useSubscriptionStore((s) => s.subscribe);
  const [step, setStep] = useState<Step>('review');
  const [outcome, setOutcome] = useState<'ok' | 'fail'>('ok');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const price = t(`premium.paywall.${PRICE_KEY[plan]}`);
  const [trialEndsAt] = useState(() => new Date(Date.now() + 7 * 86_400_000));
  const trialEnds = new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'long' }).format(
    trialEndsAt
  );
  const close = () => {
    setStep('review');
    onClose();
  };

  const confirm = () => {
    setStep('loading');
    timer.current = setTimeout(() => {
      if (outcome === 'fail') return setStep('failed');
      subscribe(plan, trial);
      setStep('review');
      onClose();
      router.replace('/premium/success' as Href);
    }, 1400);
  };

  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    setStep('cancelled');
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={step === 'review' || step === 'loading' ? t('premium.checkout.title') : undefined}
    >
      {step === 'review' || step === 'loading' ? (
        <>
          <View className="gap-3 rounded-card bg-bgMist p-4">
            <Row label={t('premium.checkout.plan')} value={t(`premium.paywall.${plan}`)} />
            <Row label={t('premium.checkout.price')} value={price} />
            <View className="h-px bg-hairline" />
            <View className="gap-1">
              <Text variant="callout">{t('premium.checkout.billing')}</Text>
              <Text variant="body" className="text-muted-foreground">
                {trial
                  ? t('premium.checkout.billingTrial', { price, date: trialEnds })
                  : t('premium.checkout.billingNow', { price })}
              </Text>
            </View>
          </View>
          <Text variant="footnote" className="text-center">
            {t('premium.checkout.proto')}
          </Text>
          {__DEV__ ? (
            <View className="gap-2" role="radiogroup">
              <Text variant="footnote">{t('premium.checkout.outcome')}</Text>
              <View className="flex-row gap-2">
                <Chip
                  label={t('premium.checkout.outcomeOk')}
                  selected={outcome === 'ok'}
                  onPress={() => setOutcome('ok')}
                />
                <Chip
                  label={t('premium.checkout.outcomeFail')}
                  selected={outcome === 'fail'}
                  onPress={() => setOutcome('fail')}
                />
              </View>
            </View>
          ) : null}
          <Button size="lg" loading={step === 'loading'} onPress={confirm}>
            <Text>
              {step === 'loading' ? t('premium.checkout.confirming') : t('premium.checkout.confirm')}
            </Text>
          </Button>
          <Button variant="ghost" onPress={step === 'loading' ? cancel : close}>
            <Text>{t('premium.checkout.cancel')}</Text>
          </Button>
        </>
      ) : (
        <View className="items-center gap-3">
          <Character name="kai" pose="float" mood={step === 'failed' ? 'tired' : 'calm'} size={100} />
          <Text variant="title2" className="text-center" accessibilityRole="header">
            {step === 'failed' ? t('premium.checkout.failTitle') : t('premium.checkout.cancelledTitle')}
          </Text>
          <Text variant="body" className="text-center text-muted-foreground">
            {step === 'failed' ? t('premium.checkout.failBody') : t('premium.checkout.cancelledBody')}
          </Text>
          {step === 'failed' ? (
            <Button size="lg" className="w-full" onPress={() => setStep('review')}>
              <Text>{t('premium.checkout.retry')}</Text>
            </Button>
          ) : null}
          <Button variant={step === 'failed' ? 'ghost' : 'secondary'} className="w-full" onPress={close}>
            <Text>{t('premium.checkout.backToPlans')}</Text>
          </Button>
        </View>
      )}
    </BottomSheet>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text variant="callout" className="text-muted-foreground">
        {label}
      </Text>
      <Text variant="title3">{value}</Text>
    </View>
  );
}
