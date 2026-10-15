import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Character, HUMAN_POSES, KAI_POSES } from '@/characters/character';
import { signature, type CharacterName } from '@/characters/palette';
import type { Pose } from '@/characters/types';
import {
  Bench,
  ConfettiLeaves,
  LightRays,
  LotusLogo,
  SceneBackground,
  ThoughtIcon,
} from '@/characters/props';
import { CharacterAvatar } from '@/components/character-avatar';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Text } from '@/components/ui/text';
import { MOODS, type Mood } from '@/store/types';
import { useAppStore } from '@/store';
import { useTheme } from '@/theme/theme-provider';

const NAMES: CharacterName[] = ['hina', 'arfa', 'hamid', 'sierra', 'kai'];
const SIGNATURE: Record<CharacterName, string> = {
  hina: 'Lilac dupatta · hair tied back with a clip · office lanyard',
  arfa: 'Teal cardigan · long wavy hair in a loose braid · stud earrings',
  hamid: 'Mustard sweater over a collared shirt · round glasses · light stubble',
  sierra: 'Coral knit cardigan · loose curls · hoop earrings',
  kai: 'Sage lotus-leaf sprite · soft glow · floats',
};

/** Card C-07 – design-review sheet: every character × pose × mood, with theme / size / RTL toggles. */
export default function CharacterSheet() {
  const insets = useSafeAreaInsets();
  const { colors, scheme } = useTheme();
  const set = useAppStore((s) => s.set);
  const theme = useAppStore((s) => s.theme);
  const [size, setSize] = useState(170);
  const [flip, setFlip] = useState(false);
  const [animated, setAnimated] = useState(true);
  const [mood, setMood] = useState<Mood>('calm');
  const [pose, setPose] = useState<Pose>('stand');
  const [outfit, setOutfit] = useState<'everyday' | 'yoga'>('everyday');
  const [clay, setClay] = useState(true);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 48,
        paddingHorizontal: 16,
        gap: 28,
      }}
    >
      <View className="gap-1">
        <Text variant="title">Character sheet</Text>
        <Text variant="caption">{`Same component everywhere · ${scheme} mode · signature colour + one accessory each`}</Text>
      </View>

      <View className="gap-3">
        <View className="flex-row flex-wrap gap-2">
          <Chip label="Light" selected={theme === 'light'} onPress={() => set({ theme: 'light' })} />
          <Chip label="Dark" selected={theme === 'dark'} onPress={() => set({ theme: 'dark' })} />
          <Chip label="Flip (RTL)" selected={flip} onPress={() => setFlip((f) => !f)} />
          <Chip label="Animated" selected={animated} onPress={() => setAnimated((a) => !a)} />
          <Chip label="Clay look" selected={clay} onPress={() => setClay((c) => !c)} />
          <Chip
            label="Yoga outfit"
            selected={outfit === 'yoga'}
            onPress={() => setOutfit((o) => (o === 'yoga' ? 'everyday' : 'yoga'))}
          />
        </View>
        <View className="flex-row flex-wrap gap-2">
          {[110, 170, 240].map((s) => (
            <Chip key={s} label={`${s}px`} selected={size === s} onPress={() => setSize(s)} />
          ))}
        </View>
        <View className="flex-row flex-wrap gap-2">
          {MOODS.map((m) => (
            <Chip key={m} label={m} selected={mood === m} onPress={() => setMood(m)} />
          ))}
        </View>
        <View className="flex-row flex-wrap gap-2">
          {(
            [
              'stand',
              'sit',
              'wave',
              'yoga',
              'reach',
              'sideReach',
              'float',
              'celebrate',
              'bell',
              'sleep',
            ] as Pose[]
          ).map((p) => (
            <Chip key={p} label={p} selected={pose === p} onPress={() => setPose(p)} />
          ))}
        </View>
      </View>

      {/* Lineup: all five with the chosen pose + mood */}
      <View className="flex-row flex-wrap items-end justify-around gap-2 rounded-card border border-border bg-card p-4">
        {NAMES.map((n) => (
          <View key={n} className="items-center gap-1">
            <Character
              name={n}
              pose={pose}
              mood={mood}
              size={size}
              flip={flip}
              animated={animated}
              outfit={outfit}
              look={clay ? 'clay' : 'flat'}
            />
            <Text variant="label">{n}</Text>
          </View>
        ))}
      </View>

      {NAMES.map((n) => (
        <View key={n} className="gap-3">
          <View className="flex-row items-center gap-3">
            <CharacterAvatar name={n} size={52} ring />
            <View className="flex-1">
              <Text variant="heading" className="capitalize">
                {n}
              </Text>
              <Text variant="caption">{SIGNATURE[n]}</Text>
            </View>
            <View style={{ backgroundColor: signature[n] }} className="size-6 rounded-full" />
          </View>
          <Text variant="label">Poses ({mood})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {(n === 'kai' ? KAI_POSES : HUMAN_POSES).map((p) => (
              <View key={p} className="items-center gap-1 rounded-2xl border border-border bg-card p-2">
                <Character
                  name={n}
                  pose={p}
                  mood={mood}
                  size={130}
                  flip={flip}
                  animated={false}
                  outfit={outfit}
                  look={clay ? 'clay' : 'flat'}
                />
                <Text variant="caption">{p}</Text>
              </View>
            ))}
          </ScrollView>
          <Text variant="label">Moods ({pose})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {MOODS.map((m) => (
              <View key={m} className="items-center gap-1 rounded-2xl border border-border bg-card p-2">
                <Character name={n} pose={pose} mood={m} size={130} flip={flip} animated={false} />
                <Text variant="caption">{m}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      ))}

      <View className="gap-3">
        <Text variant="heading">Avatars (bust crop)</Text>
        <View className="flex-row flex-wrap gap-3">
          {NAMES.map((n) => (
            <CharacterAvatar key={n} name={n} size={56} />
          ))}
          {NAMES.map((n) => (
            <CharacterAvatar key={n + 'r'} name={n} size={40} ring mood="calm" />
          ))}
        </View>
      </View>

      <View className="gap-3">
        <Text variant="heading">Scene props</Text>
        <View className="items-center gap-4 overflow-hidden rounded-card border border-border bg-card p-4">
          <View className="flex-row items-end gap-3">
            <ThoughtIcon kind="hamid" size={70} />
            <ThoughtIcon kind="hina" size={70} />
            <ThoughtIcon kind="sierra" size={70} />
          </View>
          <Bench width={300} />
          <Bench width={300} muted />
          <LotusLogo size={88} />
        </View>
        <View style={{ height: 180, borderRadius: 24, overflow: 'hidden', backgroundColor: colors.mint }}>
          <SceneBackground colors={[colors.sunriseSoft, colors.bg]} />
          <LightRays width={340} height={180} />
          <ConfettiLeaves width={340} height={180} count={10} />
          <View className="items-center justify-end pt-4" style={{ flex: 1 }}>
            <Character name="kai" pose="celebrate" mood="happy" size={130} animated={animated} />
          </View>
        </View>
      </View>

      <Button variant="ghost" onPress={() => router.back()}>
        <Text>Back</Text>
      </Button>
    </ScrollView>
  );
}
