import { router } from 'expo-router';
import { Heart, Leaf, Moon, Sparkle } from 'phosphor-react-native';
import { useState } from 'react';
import { BottomSheet } from '@/components/bottom-sheet';
import { GlassCard } from '@/components/glass-card';
import { SceneBackground } from '@/characters/props';
import { BreathingCircle } from '@/components/breathing-circle';
import { EmptyState } from '@/components/empty-state';
import { ExerciseCard } from '@/components/exercise-card';
import { MoodPicker } from '@/components/mood-picker';
import { ProgramCard } from '@/components/program-card';
import { ProgressRing } from '@/components/progress-ring';
import { RoutineCard } from '@/components/routine-card';
import { SafetyNotice } from '@/components/safety-notice';
import { SectionHeader } from '@/components/section-header';
import { SpeechBubble } from '@/components/speech-bubble';
import { toast } from '@/components/toast';
import { getExercise, getProgram, getRoutine } from '@/data/repo';
import type { Mood } from '@/store/types';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { useAppStore } from '@/store';
import { useTheme } from '@/theme/theme-provider';

const SWATCHES = [
  'bg',
  'bgMist',
  'auroraMint',
  'auroraSky',
  'forest',
  'ink',
  'muted',
  'primary',
  'leaf',
  'mint',
  'sky',
  'skySoft',
  'lavender',
  'lavenderSoft',
  'sunrise',
  'sunriseSoft',
  'hairline',
  'danger',
] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-3">
      <Text variant="heading">{title}</Text>
      {children}
    </View>
  );
}

/** Card F-08 — every primitive in one place for light / dark / RTL / 130% text review. */
export default function UiKit() {
  const insets = useSafeAreaInsets();
  const { colors, scheme } = useTheme();
  const { t } = useT();
  const set = useAppStore((s) => s.set);
  const theme = useAppStore((s) => s.theme);
  const language = useAppStore((s) => s.language);
  const motion = useAppStore((s) => s.motion);
  const [chips, setChips] = useState<string[]>(['Beginner']);
  const [checked, setChecked] = useState(true);
  const [on, setOn] = useState(true);
  const [radio, setRadio] = useState('10');
  const [mood, setMood] = useState<Mood | null>('calm');
  const [favs, setFavs] = useState<string[]>(['ex-06']);
  const [sheet, setSheet] = useState(false);
  const [ring, setRing] = useState(0.65);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 48,
        paddingHorizontal: 16,
        gap: 32,
      }}
    >
      <View className="gap-1">
        <Text variant="display">{t('common.appName')}</Text>
        <Text variant="caption">{`UI kit · ${scheme} · ${language}`}</Text>
      </View>

      <Section title="Controls">
        <View className="flex-row flex-wrap gap-2">
          {(['light', 'dark', 'system'] as const).map((v) => (
            <Chip key={v} label={`Theme: ${v}`} selected={theme === v} onPress={() => set({ theme: v })} />
          ))}
          {(['en', 'ur'] as const).map((v) => (
            <Chip
              key={v}
              label={t(`languages.${v}`)}
              selected={language === v}
              onPress={() => set({ language: v })}
            />
          ))}
          <Chip
            label="Reduce motion"
            selected={motion === 'reduce'}
            onPress={() => set({ motion: motion === 'reduce' ? 'system' : 'reduce' })}
          />
        </View>
        <Text variant="caption">
          Switching to Urdu flips the layout after a reload (React Native limitation).
        </Text>
      </Section>

      <Section title="Type scale">
        <Text variant="display">Small steps. Calmer days.</Text>
        <Text variant="title">Today&apos;s session</Text>
        <Text variant="heading">Quick relief</Text>
        <Text variant="lead">Lead — ten gentle minutes for your morning.</Text>
        <Text variant="body">Body — breathe in slowly, let your shoulders soften.</Text>
        <Text variant="label">Label — Start session</Text>
        <Text variant="caption">Caption — Everyone&apos;s experience is different.</Text>
      </Section>

      <Section title="Colour tokens">
        <View className="flex-row flex-wrap gap-3">
          {SWATCHES.map((name) => (
            <View key={name} className="items-center gap-1">
              <View
                className="size-14 rounded-2xl border border-border"
                style={{ backgroundColor: colors[name] }}
              />
              <Text variant="caption">{name}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Buttons">
        <Button onPress={() => {}}>
          <Text>Start session</Text>
        </Button>
        <Button variant="secondary">
          <Text>Explore first</Text>
        </Button>
        <Button variant="sunrise">
          <Text>Calm my anxiety</Text>
        </Button>
        <Button variant="outline">
          <Text>Outline</Text>
        </Button>
        <Button variant="ghost">
          <Text>Not now</Text>
        </Button>
        <Button variant="destructive">
          <Text>End session</Text>
        </Button>
        <Button loading>
          <Text>Loading</Text>
        </Button>
        <Button disabled>
          <Text>Disabled</Text>
        </Button>
        <View className="flex-row gap-3">
          <Button size="icon" variant="secondary" accessibilityLabel="Favourite">
            <Icon as={Heart} />
          </Button>
          <Button size="icon" accessibilityLabel="Sparkle">
            <Icon as={Sparkle} className="text-primary-foreground" />
          </Button>
        </View>
      </Section>

      <Section title="Chips & badges">
        <View className="flex-row flex-wrap gap-2">
          {['Beginner', 'Chair-friendly', 'Evening', '10 min'].map((c) => (
            <Chip
              key={c}
              label={c}
              selected={chips.includes(c)}
              onPress={() => setChips((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]))}
            />
          ))}
        </View>
        <View className="flex-row flex-wrap gap-2">
          <Badge>
            <Text>Default</Text>
          </Badge>
          <Badge variant="secondary">
            <Text>Secondary</Text>
          </Badge>
          <Badge variant="sky">
            <Text>Day 5 of 30</Text>
          </Badge>
          <Badge variant="lavender">
            <Text>Sleep</Text>
          </Badge>
          <Badge variant="sunrise">
            <Text>Gentle</Text>
          </Badge>
          <Badge variant="outline">
            <Text>Outline</Text>
          </Badge>
        </View>
      </Section>

      <Section title="Cards">
        <Card>
          <CardHeader>
            <View className="flex-row items-center gap-2">
              <Icon as={Leaf} weight="duotone" size={24} className="text-leaf" />
              <CardTitle>Morning flow</CardTitle>
            </View>
            <CardDescription>10 min · Beginner · Standing</CardDescription>
          </CardHeader>
          <CardContent>
            <Text>Soft shadow, radius 24, generous padding.</Text>
          </CardContent>
        </Card>
        <Card variant="mint">
          <CardContent>
            <Text>Mint card</Text>
          </CardContent>
        </Card>
        <Card variant="lavender">
          <CardContent className="flex-row items-center gap-2">
            <Icon as={Moon} weight="duotone" size={24} />
            <Text>Sleep &amp; wind-down</Text>
          </CardContent>
        </Card>
      </Section>

      <Section title="Form controls">
        <View className="gap-2">
          <Label nativeID="email">Email</Label>
          <Input aria-labelledby="email" placeholder="you@example.com" />
        </View>
        <Input placeholder="With error" invalid />
        <View className="flex-row items-center gap-3">
          <Checkbox checked={checked} onCheckedChange={setChecked} aria-label="I understand" />
          <Text>I understand</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Switch checked={on} onCheckedChange={setOn} aria-label="Music" />
          <Text>Music {on ? 'on' : 'off'}</Text>
        </View>
        <RadioGroup value={radio} onValueChange={setRadio} className="gap-3">
          {['5', '10', '15', '20'].map((v) => (
            <View key={v} className="flex-row items-center gap-3">
              <RadioGroupItem value={v} aria-labelledby={`r${v}`} />
              <Label nativeID={`r${v}`} onPress={() => setRadio(v)}>{`${v} min`}</Label>
            </View>
          ))}
        </RadioGroup>
      </Section>

      <Section title="Progress, separator, skeleton">
        <Progress value={40} className="h-3" />
        <Separator />
        <View className="gap-2">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-24 w-full" />
        </View>
      </Section>

      <Section title="Glass surfaces">
        <View style={{ height: 230, borderRadius: 24, overflow: 'hidden' }}>
          <SceneBackground colors={scheme === 'dark' ? ['#183025', '#2A2418'] : ['#BFE3CB', '#F6D9B8']} />
          <View
            style={{
              position: 'absolute',
              top: 18,
              start: 24,
              width: 110,
              height: 110,
              borderRadius: 55,
              backgroundColor: colors.sunrise,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 70,
              end: 30,
              width: 140,
              height: 140,
              borderRadius: 70,
              backgroundColor: colors.lavender,
            }}
          />
          <View style={{ position: 'absolute', start: 14, end: 14, top: 14, gap: 10 }}>
            <GlassCard radius={18} contentStyle={{ padding: 12 }}>
              <Text variant="label">Subtle glass</Text>
            </GlassCard>
            <GlassCard radius={20} contentStyle={{ padding: 14 }}>
              <Text variant="label">Standard glass</Text>
              <Text variant="caption">Blur + translucent fill + hairline border</Text>
            </GlassCard>
            <GlassCard strong radius={22} contentStyle={{ padding: 16 }}>
              <Text variant="label">Strong glass (sheets, pinned footers)</Text>
            </GlassCard>
          </View>
        </View>
      </Section>

      <Section title="Mood picker">
        <MoodPicker value={mood} onChange={setMood} />
      </Section>

      <Section title="Breathing circle & progress ring">
        <View className="items-center">
          <BreathingCircle size={220} showCue />
        </View>
        <View className="flex-row items-center justify-around">
          <ProgressRing progress={ring} size={48} strokeWidth={5} />
          <ProgressRing progress={ring} size={96}>
            <Text variant="label">{`${Math.round(ring * 100)}%`}</Text>
          </ProgressRing>
          <ProgressRing progress={ring} size={140} strokeWidth={12} color="sunrise">
            <Text variant="title">{`${Math.round(ring * 10)}:00`}</Text>
          </ProgressRing>
        </View>
        <Button variant="secondary" onPress={() => setRing((r) => (r >= 0.95 ? 0.05 : r + 0.15))}>
          <Text>Advance ring</Text>
        </Button>
      </Section>

      <Section title="Speech bubbles">
        <SpeechBubble
          speaker="ali"
          text="Eight hours at the desk… my neck and back feel so stiff."
          tail="start"
        />
        <SpeechBubble
          speaker="hina"
          text="I lie in bed for hours. My mind just won't switch off."
          delay={600}
          tail="end"
        />
        <SpeechBubble
          speaker="zara"
          text="It didn't change overnight. It changed one small step at a time — that's Kaizen."
          delay={1200}
        />
        <SpeechBubble speaker="kai" text="After one month of small steps…" delay={1800} tail="end" />
      </Section>

      <Section title="Exercise, routine & program cards">
        <SectionHeader title="Poses" onSeeAll={() => toast.info('See all tapped')} />
        {['ex-01', 'ex-16', 'ex-26'].map((id) => (
          <ExerciseCard
            key={id}
            exercise={getExercise(id)}
            isFavorite={favs.includes(id)}
            onFavorite={() => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))}
            onPress={() => toast.info(getExercise(id).name)}
          />
        ))}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {['ex-31', 'ex-11', 'ex-46', 'ex-41'].map((id) => (
            <ExerciseCard key={id} variant="tile" exercise={getExercise(id)} />
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {['r-04', 'r-10', 'r-11', 'qr-01'].map((id) => (
            <RoutineCard key={id} routine={getRoutine(id)} downloaded={id === 'r-04'} />
          ))}
        </ScrollView>
        <RoutineCard variant="row" routine={getRoutine('r-02')} />
        <ProgramCard program={getProgram('p-30')} completedDays={5} />
        <ProgramCard program={getProgram('p-desk')} />
      </Section>

      <Section title="Safety, empty state, toast, sheet">
        <SafetyNotice title="A gentle reminder" lines={['Stop if you feel sharp pain or dizziness.']} />
        <SafetyNotice
          variant="full"
          title="Before we begin"
          lines={[
            'If you are pregnant, recovering from surgery or managing a health condition, check with a healthcare professional first.',
          ]}
        />
        <EmptyState
          title="No favourites yet"
          body="Tap the heart on any pose or routine to keep it here."
          cta={{ label: 'Explore', onPress: () => toast.gentle('Opening Explore…') }}
        />
        <View className="flex-row flex-wrap gap-2">
          <Button size="sm" variant="secondary" onPress={() => toast.success('Saved to favourites')}>
            <Text>Success toast</Text>
          </Button>
          <Button size="sm" variant="secondary" onPress={() => toast.info('You are offline')}>
            <Text>Info toast</Text>
          </Button>
          <Button size="sm" variant="secondary" onPress={() => toast.gentle('Rest is part of practice too.')}>
            <Text>Gentle toast</Text>
          </Button>
          <Button size="sm" variant="outline" onPress={() => setSheet(true)}>
            <Text>Open sheet</Text>
          </Button>
        </View>
        <BottomSheet visible={sheet} onClose={() => setSheet(false)} title="Feeling discomfort?">
          <Text>Stop if you feel sharp pain or dizziness.</Text>
          <Button variant="secondary">
            <Text>Switch to an easier version</Text>
          </Button>
          <Button variant="secondary">
            <Text>Skip this pose</Text>
          </Button>
          <Button variant="destructive">
            <Text>End session</Text>
          </Button>
        </BottomSheet>
      </Section>

      <Section title="Dev links">
        <Button variant="secondary" onPress={() => router.push('/dev/icons')}>
          <Text>Kaizen icon set</Text>
        </Button>
      </Section>

      <Button variant="ghost" onPress={() => router.back()}>
        <Text>Back</Text>
      </Button>
    </ScrollView>
  );
}
