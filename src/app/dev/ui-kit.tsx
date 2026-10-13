/* eslint-disable no-restricted-syntax -- developer-only screen, strings are intentionally inline */
import { router } from 'expo-router';
import { Heart, Leaf, Moon, Sparkle } from 'phosphor-react-native';
import { useState } from 'react';
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

const SWATCHES = ['forest', 'sage', 'mint', 'cream', 'sand', 'coral', 'lavender', 'ink'] as const;

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
  const { tokens, scheme } = useTheme();
  const { t } = useT();
  const set = useAppStore((s) => s.set);
  const theme = useAppStore((s) => s.theme);
  const language = useAppStore((s) => s.language);
  const motion = useAppStore((s) => s.motion);
  const [chips, setChips] = useState<string[]>(['Beginner']);
  const [checked, setChecked] = useState(true);
  const [on, setOn] = useState(true);
  const [radio, setRadio] = useState('10');

  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 48, paddingHorizontal: 16, gap: 32 }}>
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
            <Chip key={v} label={t(`languages.${v}`)} selected={language === v} onPress={() => set({ language: v })} />
          ))}
          <Chip label="Reduce motion" selected={motion === 'reduce'} onPress={() => set({ motion: motion === 'reduce' ? 'system' : 'reduce' })} />
        </View>
        <Text variant="caption">Switching to Urdu flips the layout after a reload (React Native limitation).</Text>
      </Section>

      <Section title="Type scale">
        <Text variant="display">Small steps. Calmer days.</Text>
        <Text variant="title">Today's session</Text>
        <Text variant="heading">Quick relief</Text>
        <Text variant="lead">Lead — ten gentle minutes for your morning.</Text>
        <Text variant="body">Body — breathe in slowly, let your shoulders soften.</Text>
        <Text variant="label">Label — Start session</Text>
        <Text variant="caption">Caption — Everyone's experience is different.</Text>
      </Section>

      <Section title="Colour tokens">
        <View className="flex-row flex-wrap gap-3">
          {SWATCHES.map((name) => (
            <View key={name} className="items-center gap-1">
              <View className="border-border size-14 rounded-2xl border" style={{ backgroundColor: tokens[name] }} />
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
        <Button variant="coral">
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
          <Badge><Text>Default</Text></Badge>
          <Badge variant="secondary"><Text>Secondary</Text></Badge>
          <Badge variant="coral"><Text>Day 5 of 30</Text></Badge>
          <Badge variant="lavender"><Text>Sleep</Text></Badge>
          <Badge variant="sand"><Text>Gentle</Text></Badge>
          <Badge variant="outline"><Text>Outline</Text></Badge>
        </View>
      </Section>

      <Section title="Cards">
        <Card>
          <CardHeader>
            <View className="flex-row items-center gap-2">
              <Icon as={Leaf} weight="duotone" size={24} className="text-sage" />
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

      <Button variant="ghost" onPress={() => router.back()}>
        <Text>Back</Text>
      </Button>
    </ScrollView>
  );
}
