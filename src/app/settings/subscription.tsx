import { router, type Href } from 'expo-router';
import { ArrowsLeftRight, ArrowCounterClockwise, CreditCard, XCircle } from 'phosphor-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { BottomSheet } from '@/components/bottom-sheet';
import { toast } from '@/components/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Text } from '@/components/ui/text';
import { PRICE_KEY, type PaidPlan } from '@/features/premium/plans';
import { Group, Row, SettingsScreen } from '@/features/settings/ui';
import { useT } from '@/i18n';
import {
  daysLeft,
  effectiveStatus,
  useSubscriptionStore,
  type SubscriptionStatus,
} from '@/store/subscription-store';

const REASONS = ['price', 'unused', 'content', 'other'] as const;
const STATES: SubscriptionStatus[] = ['free', 'trial', 'active', 'cancelled', 'expired'];

/** Manage subscription (M-03): status, switch plan, restore, and a gentle, no-dark-pattern cancel. */
export default function SubscriptionScreen() {
  const { t, i18n } = useT();
  const sub = useSubscriptionStore();
  const [sheet, setSheet] = useState(false);
  const [reason, setReason] = useState<(typeof REASONS)[number] | null>(null);

  const status = effectiveStatus(sub);
  const date = (iso: string | null) =>
    iso
      ? new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }).format(
          new Date(iso)
        )
      : '';
  const paid = status === 'trial' || status === 'active' || status === 'cancelled';
  const endDate = date(sub.endsAt ?? sub.renewsAt);
  const left = daysLeft(sub.trialEndsAt);

  const summary =
    status === 'trial'
      ? [
          left === 1 ? t('premium.manage.trialLeftOne') : t('premium.manage.trialLeft', { count: left }),
          t('premium.manage.renews', { date: date(sub.renewsAt) }),
        ]
      : status === 'active'
        ? [t('premium.manage.renews', { date: date(sub.renewsAt) })]
        : status === 'cancelled'
          ? [t('premium.manage.keepUntil', { date: endDate })]
          : status === 'expired'
            ? [t('premium.manage.expiredOn', { date: date(sub.endsAt) })]
            : [t('premium.manage.freeBody')];

  const switchTo = (plan: PaidPlan) => {
    if (plan === sub.plan) return;
    sub.switchPlan(plan);
    toast.success(t('premium.manage.switched', { plan: t(`premium.manage.plan.${plan}`) }));
  };

  return (
    <SettingsScreen title={t('premium.manage.title')}>
      <View className="mx-4 gap-3 rounded-card border border-hairline bg-bgMist p-4">
        <View className="flex-row flex-wrap items-center gap-2">
          <Text variant="title3" className="flex-1">
            {status === 'free'
              ? t('premium.manage.freeTitle')
              : `Kaizen Premium · ${t(`premium.manage.plan.${sub.plan}`)}`}
          </Text>
          {status !== 'free' ? (
            <Badge variant={status === 'expired' ? 'outline' : 'secondary'}>
              <Text>{t(`premium.manage.status.${status}`)}</Text>
            </Badge>
          ) : null}
        </View>
        {summary.map((line) => (
          <Text key={line} variant="body" className="text-muted-foreground">
            {line}
          </Text>
        ))}
        {status === 'free' || status === 'expired' ? (
          <Button onPress={() => router.push('/premium' as Href)}>
            <Text>
              {status === 'expired' ? t('premium.manage.resubscribe') : t('premium.manage.seePremium')}
            </Text>
          </Button>
        ) : null}
        {status === 'cancelled' ? (
          <Button
            onPress={() => {
              sub.resume();
              toast.success(t('premium.manage.resumed'));
            }}
          >
            <Text>{t('premium.manage.resume')}</Text>
          </Button>
        ) : null}
      </View>

      {paid ? (
        <>
          <Group title={t('premium.manage.switchTitle')}>
            {(['monthly', 'yearly'] as PaidPlan[]).map((p, i) => (
              <Row
                key={p}
                first={i === 0}
                icon={ArrowsLeftRight}
                label={t(`premium.manage.plan.${p}`)}
                sub={t(`premium.paywall.${PRICE_KEY[p]}`)}
                right={
                  p === sub.plan ? (
                    <Badge variant="secondary">
                      <Text>{t('premium.manage.current')}</Text>
                    </Badge>
                  ) : undefined
                }
                onPress={p === sub.plan ? undefined : () => switchTo(p)}
              />
            ))}
          </Group>
          <Group>
            <Row
              first
              icon={CreditCard}
              label={t('premium.manage.payment')}
              sub={t('premium.manage.paymentBody')}
            />
            <Row
              icon={ArrowCounterClockwise}
              label={t('premium.manage.restore')}
              onPress={() =>
                toast.info(
                  sub.restore() ? t('premium.paywall.restored') : t('premium.paywall.nothingToRestore')
                )
              }
            />
            {status !== 'cancelled' ? (
              <Row
                icon={XCircle}
                danger
                chevron={false}
                label={t('premium.manage.cancel')}
                onPress={() => {
                  setReason(null);
                  setSheet(true);
                }}
              />
            ) : null}
          </Group>
        </>
      ) : null}

      {__DEV__ ? (
        <Group title="Prototype: preview a state">
          <View className="flex-row flex-wrap gap-2 p-4">
            {STATES.map((s) => (
              <Chip
                key={s}
                label={s}
                selected={status === s}
                onPress={() => {
                  const day = 86_400_000;
                  const iso = (d: number) => new Date(Date.now() + d * day).toISOString();
                  useSubscriptionStore.setState(
                    s === 'free'
                      ? { plan: 'free', status: 'free', trialEndsAt: null, renewsAt: null, endsAt: null }
                      : s === 'trial'
                        ? {
                            plan: sub.plan === 'free' ? 'yearly' : sub.plan,
                            status: 'trial',
                            trialEndsAt: iso(5),
                            renewsAt: iso(5),
                            endsAt: null,
                          }
                        : s === 'active'
                          ? {
                              plan: sub.plan === 'free' ? 'yearly' : sub.plan,
                              status: 'active',
                              trialEndsAt: null,
                              renewsAt: iso(120),
                              endsAt: null,
                            }
                          : s === 'cancelled'
                            ? {
                                plan: sub.plan === 'free' ? 'yearly' : sub.plan,
                                status: 'cancelled',
                                renewsAt: iso(40),
                                endsAt: iso(40),
                              }
                            : {
                                plan: sub.plan === 'free' ? 'yearly' : sub.plan,
                                status: 'cancelled',
                                renewsAt: iso(-10),
                                endsAt: iso(-10),
                              }
                  );
                }}
              />
            ))}
          </View>
        </Group>
      ) : null}

      <BottomSheet visible={sheet} onClose={() => setSheet(false)} title={t('premium.manage.cancelTitle')}>
        <Text variant="body">{t('premium.manage.cancelBody', { date: endDate })}</Text>
        <View className="gap-2">
          <Text variant="callout">{t('premium.manage.reasonTitle')}</Text>
          <View className="flex-row flex-wrap gap-2" role="radiogroup">
            {REASONS.map((r) => (
              <Chip
                key={r}
                label={t(`premium.manage.reasons.${r}`)}
                selected={reason === r}
                onPress={() => setReason(reason === r ? null : r)}
              />
            ))}
          </View>
        </View>
        <Button size="lg" onPress={() => setSheet(false)}>
          <Text>{t('premium.manage.keep')}</Text>
        </Button>
        <Button
          variant="ghost"
          onPress={() => {
            setSheet(false);
            sub.cancel();
            toast.gentle(t('premium.manage.cancelled', { date: endDate }));
          }}
        >
          <Text>{t('premium.manage.confirmCancel')}</Text>
        </Button>
      </BottomSheet>
    </SettingsScreen>
  );
}
