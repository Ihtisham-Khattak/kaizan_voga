import { router, type Href } from 'expo-router';
import {
  Bell,
  Download,
  Eye,
  FirstAidKit,
  Handshake,
  HeartStraight,
  Info,
  Leaf,
  Lifebuoy,
  Lock,
  Question,
  FileText,
  SignOut,
  SlidersHorizontal,
  Target,
  PencilSimple,
  PlayCircle,
  Crown,
  CaretRight,
} from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { signature } from '@/characters/palette';
import { AuroraBackground } from '@/components/aurora-background';
import { BottomSheet } from '@/components/bottom-sheet';
import { CharacterAvatar } from '@/components/character-avatar';
import { FadeUp } from '@/components/fade-up';
import { GlassCard } from '@/components/glass-card';
import { TAB_BAR_CLEARANCE } from '@/components/tab-bar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Group, Row } from '@/features/settings/ui';
import { ProfileSkeleton } from '@/features/states/skeletons';
import { useScreenLoading } from '@/hooks/use-screen-loading';
import { useT } from '@/i18n';
import { JOURNEY_DAYS, journeyDay } from '@/lib/journey';
import { useAppStore } from '@/store/app-store';
import { useAuthStore } from '@/store/auth-store';
import { usePrefsStore } from '@/store/prefs-store';
import { useSubscriptionStore } from '@/store/subscription-store';

type Avatar = 'arfa' | 'hamid' | 'hina' | 'sierra';
const AVATARS: Avatar[] = ['arfa', 'hamid', 'hina', 'sierra'];
const go = (href: string) => () => router.push(href as Href);

/** Profile: who you are, your plan, your account, and every setting in one calm list. */
export default function ProfileScreen() {
  const { t } = useT();
  const loading = useScreenLoading();
  const insets = useSafeAreaInsets();
  const prefs = usePrefsStore();
  const startedAt = useAppStore((s) => s.journeyStartedAt);
  const replayIntro = useAppStore((s) => s.replayIntro);
  const auth = useAuthStore();
  const premium = useSubscriptionStore((s) => s.status === 'active' || s.status === 'trial');
  const [sheet, setSheet] = useState<null | 'edit' | 'signout' | 'replay'>(null);
  const [draftName, setDraftName] = useState(prefs.name);
  const [draftAvatar, setDraftAvatar] = useState<Avatar>(prefs.avatar);

  const name = prefs.name || auth.user?.name || t('pf.profile.friend');
  const day = journeyDay(startedAt);
  const close = () => setSheet(null);

  if (loading) return <ProfileSkeleton />;

  return (
    <View className="flex-1 bg-background">
      <AuroraBackground />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: TAB_BAR_CLEARANCE + 24,
          gap: 24,
        }}
      >
        <FadeUp>
          <View className="items-center gap-3 px-4">
            <CharacterAvatar name={prefs.avatar} size={96} ring mood="happy" />
            <View className="items-center gap-1">
              <Text variant="title1" accessibilityRole="header" className="text-center">
                {name}
              </Text>
              <Pressable
                onPress={() => {
                  setDraftName(prefs.name);
                  setDraftAvatar(prefs.avatar);
                  setSheet('edit');
                }}
                accessibilityRole="button"
                accessibilityLabel={t('pf.profile.edit')}
                className="min-h-11 flex-row items-center gap-2 rounded-pill bg-secondary px-4"
              >
                <Icon as={PencilSimple} size={16} className="text-secondary-foreground" />
                <Text variant="label" className="text-secondary-foreground">
                  {t('pf.profile.edit')}
                </Text>
              </Pressable>
            </View>
          </View>
        </FadeUp>

        <FadeUp delay={80}>
          <View className="gap-3 px-4">
            <Text variant="label" accessibilityRole="header" className="px-1 text-muted-foreground">
              {t('pf.profile.about')}
            </Text>
            <View className="gap-3 rounded-3xl border border-border bg-card p-4">
              <View className="flex-row items-center justify-between">
                <Text variant="heading">{t('pf.profile.goals')}</Text>
                <Pressable
                  onPress={go('/settings/goals')}
                  accessibilityRole="button"
                  accessibilityLabel={t('pf.profile.editGoals')}
                  className="min-h-11 justify-center"
                >
                  <Text variant="label" className="text-primary underline">
                    {t('pf.profile.editGoals')}
                  </Text>
                </Pressable>
              </View>
              {prefs.goals.length ? (
                <View className="flex-row flex-wrap gap-2">
                  {prefs.goals.map((g) => (
                    <View key={g} className="flex-row items-center gap-2 rounded-pill bg-secondary px-3 py-2">
                      <Icon as={Leaf} size={14} weight="fill" className="text-primary" />
                      <Text variant="caption" className="font-sans-semibold text-secondary-foreground">
                        {t(`story.s6.goals.${g}`)}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text variant="caption">{t('pf.profile.noGoals')}</Text>
              )}
              <View className="h-px bg-border" />
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-1 gap-1">
                  <Text variant="label">{t('pf.profile.plan')}</Text>
                  <Text variant="caption">
                    {`${t('pf.profile.planLine', { minutes: prefs.minutesPerDay, days: prefs.practiceDays.length })} · ${t(`pf.profile.timeOf.${prefs.preferredTime ?? 'varies'}`)}`}
                  </Text>
                </View>
                <View className="rounded-pill bg-leaf/30 px-3 py-2">
                  <Text variant="caption" className="font-sans-semibold text-foreground">
                    {t('pf.profile.planDay', { day, total: JOURNEY_DAYS })}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </FadeUp>

        <FadeUp delay={140}>
          <View className="gap-2 px-4">
            <Text variant="label" accessibilityRole="header" className="px-1 text-muted-foreground">
              {t('pf.profile.account')}
            </Text>
            <View className="gap-3 rounded-3xl border border-border bg-card p-4">
              {auth.status === 'signedIn' ? (
                <View className="flex-row items-center gap-3">
                  <Icon as={HeartStraight} size={24} weight="duotone" className="text-primary" />
                  <Text variant="body" className="flex-1">
                    {t('pf.profile.signedInAs', { email: auth.user?.email ?? '' })}
                  </Text>
                </View>
              ) : (
                <>
                  <Text variant="heading">{t('pf.profile.guestTitle')}</Text>
                  <Text variant="body" className="text-muted-foreground">
                    {t('pf.profile.guestBody')}
                  </Text>
                  <Button onPress={go('/sign-up')}>
                    <Text>{t('pf.profile.createAccount')}</Text>
                  </Button>
                </>
              )}
            </View>
          </View>
        </FadeUp>

        {!premium ? (
          <FadeUp delay={200}>
            <Pressable
              onPress={go('/premium')}
              accessibilityRole="button"
              accessibilityLabel={`${t('pf.profile.premiumTitle')}. ${t('pf.profile.premiumBody')}`}
              className="mx-4"
            >
              <GlassCard
                radius={24}
                tone="leaf"
                contentStyle={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}
              >
                <View className="size-12 items-center justify-center rounded-full bg-mint">
                  <Icon as={Crown} size={26} weight="duotone" className="text-foreground" />
                </View>
                <View className="flex-1">
                  <Text variant="heading">{t('pf.profile.premiumTitle')}</Text>
                  <Text variant="caption">{t('pf.profile.premiumBody')}</Text>
                </View>
                <Icon as={CaretRight} size={18} className="text-muted-foreground" />
              </GlassCard>
            </Pressable>
          </FadeUp>
        ) : null}

        <Group title={t('pf.profile.settings')}>
          <Row
            first
            icon={SlidersHorizontal}
            label={t('pf.profile.rows.preferences')}
            onPress={go('/settings/preferences')}
          />
          <Row icon={Bell} label={t('pf.profile.rows.reminders')} onPress={go('/settings/reminders')} />
          <Row icon={Download} label={t('pf.profile.rows.downloads')} onPress={go('/settings/downloads')} />
          <Row
            icon={Eye}
            label={t('pf.profile.rows.accessibility')}
            onPress={go('/settings/accessibility')}
          />
          <Row icon={Handshake} label={t('pf.profile.rows.health')} onPress={go('/settings/health')} />
          <Row icon={Lock} label={t('pf.profile.rows.privacy')} onPress={go('/settings/privacy')} />
          <Row icon={Target} label={t('pf.profile.rows.goals')} onPress={go('/settings/goals')} />
        </Group>

        <Group>
          <Row
            first
            icon={FirstAidKit}
            label={t('pf.profile.rows.safety')}
            onPress={go('/settings/safety')}
          />
          <Row icon={Question} label={t('pf.profile.rows.help')} onPress={go('/settings/help')} />
          <Row icon={Lifebuoy} label={t('pf.profile.rows.support')} onPress={go('/support/resources')} />
          <Row icon={Info} label={t('pf.profile.rows.about')} onPress={go('/settings/about')} />
          <Row icon={FileText} label={t('pf.profile.rows.terms')} onPress={go('/settings/terms')} />
        </Group>

        {__DEV__ ? (
          <Group title="Developer">
            <Row first icon={Info} label="State components and toggles" onPress={go('/dev/states')} />
          </Group>
        ) : null}

        <Group>
          <Row first icon={PlayCircle} label={t('pf.profile.replay')} onPress={() => setSheet('replay')} />
          {auth.status === 'signedIn' ? (
            <Row
              icon={SignOut}
              danger
              chevron={false}
              label={t('pf.profile.signOut')}
              onPress={() => setSheet('signout')}
            />
          ) : null}
        </Group>
      </ScrollView>

      <BottomSheet visible={sheet === 'edit'} onClose={close} title={t('pf.profile.edit')}>
        <View className="gap-2">
          <Text variant="label">{t('pf.profile.nameLabel')}</Text>
          <Input
            value={draftName}
            onChangeText={setDraftName}
            placeholder={t('pf.profile.namePh')}
            accessibilityLabel={t('pf.profile.nameLabel')}
            maxLength={30}
          />
        </View>
        <View className="gap-2">
          <Text variant="label">{t('pf.profile.avatar')}</Text>
          <View className="flex-row justify-between" role="radiogroup">
            {AVATARS.map((a) => (
              <Pressable
                key={a}
                role="radio"
                aria-checked={draftAvatar === a}
                accessibilityLabel={a}
                onPress={() => setDraftAvatar(a)}
                style={{
                  borderColor: draftAvatar === a ? signature[a] : 'transparent',
                  borderWidth: 3,
                  borderRadius: 40,
                  padding: 4,
                }}
              >
                <CharacterAvatar name={a} size={64} mood="happy" />
              </Pressable>
            ))}
          </View>
        </View>
        <Button
          size="lg"
          onPress={() => {
            prefs.patch({ name: draftName.trim(), avatar: draftAvatar });
            close();
          }}
        >
          <Text>{t('pf.profile.save')}</Text>
        </Button>
      </BottomSheet>

      <BottomSheet visible={sheet === 'replay'} onClose={close} title={t('pf.profile.replayTitle')}>
        <Text variant="body">{t('pf.profile.replayBody')}</Text>
        <Button
          size="lg"
          onPress={() => {
            close();
            replayIntro();
            router.replace('/story' as Href);
          }}
        >
          <Text>{t('pf.profile.replayCta')}</Text>
        </Button>
        <Button variant="ghost" onPress={close}>
          <Text>{t('common.cancel')}</Text>
        </Button>
      </BottomSheet>

      <BottomSheet visible={sheet === 'signout'} onClose={close} title={t('pf.profile.signOutTitle')}>
        <Text variant="body">{t('pf.profile.signOutBody')}</Text>
        <Button
          size="lg"
          onPress={() => {
            close();
            auth.signOut();
            router.replace('/gate' as Href);
          }}
        >
          <Text>{t('pf.profile.signOut')}</Text>
        </Button>
        <Button variant="ghost" onPress={close}>
          <Text>{t('common.cancel')}</Text>
        </Button>
      </BottomSheet>
    </View>
  );
}
