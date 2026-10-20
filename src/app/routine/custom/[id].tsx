import { router, useLocalSearchParams } from 'expo-router';
import { ArrowDown, ArrowUp, Minus, Plus, Trash } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { EmptyFor } from '@/features/states/empty';
import { GlassCard } from '@/components/glass-card';
import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { getExercise } from '@/data/repo';
import { HeroActions } from '@/features/pose/hero-actions';
import { useT } from '@/i18n';
import { formatDuration } from '@/lib/format';
import { haptic } from '@/lib/haptics';
import { startSession, safeBack } from '@/lib/nav';
import { useLibraryStore } from '@/store/library-store';

function IconBtn({
  label,
  onPress,
  children,
  disabled,
}: {
  label: string;
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={() => {
        haptic.select();
        onPress();
      }}
      className={`size-11 items-center justify-center rounded-full bg-secondary active:opacity-80 ${disabled ? 'opacity-40' : ''}`}
    >
      {children}
    </Pressable>
  );
}

/** Custom routine builder: rename, reorder (up/down), adjust durations, remove, save, start. */
export default function CustomRoutineScreen() {
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const routine = useLibraryStore((s) => s.customRoutines.find((r) => r.id === id));
  const save = useLibraryStore((s) => s.saveCustomRoutine);
  const remove = useLibraryStore((s) => s.removeCustomRoutine);
  const [name, setName] = useState(routine?.name ?? '');

  if (!routine) {
    return (
      <View className="flex-1 justify-center bg-background">
        <EmptyState
          title={t('pose.notFound.title')}
          body={t('pose.notFound.body')}
          cta={{ label: t('common.back'), onPress: () => safeBack() }}
        />
      </View>
    );
  }

  const items = routine.items;
  const total = items.reduce((n, i) => n + i.durationSec, 0);
  const update = (next: typeof items) => save({ ...routine, name, items: next });
  const move = (i: number, d: -1 | 1) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    update(next);
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 64,
          paddingBottom: insets.bottom + 130,
          paddingHorizontal: 16,
          gap: 16,
        }}
      >
        <Text variant="title1">{t('custom.title')}</Text>
        <Input
          value={name}
          onChangeText={setName}
          onBlur={() => save({ ...routine, name: name.trim() || routine.name })}
          placeholder={t('custom.name')}
          accessibilityLabel={t('custom.name')}
        />
        <Text variant="caption">{t('custom.total', { time: formatDuration(total, t) })}</Text>

        {items.length === 0 ? (
          <EmptyFor kind="custom" />
        ) : (
          items.map((it, i) => {
            const e = getExercise(it.exerciseId);
            return (
              <View
                key={`${it.exerciseId}-${i}`}
                className="gap-3 rounded-card border border-border bg-card p-3"
              >
                <View className="flex-row items-center gap-3">
                  <View className="size-8 items-center justify-center rounded-full bg-primary">
                    <Text variant="caption" className="font-sans-bold text-primary-foreground">
                      {String(i + 1)}
                    </Text>
                  </View>
                  <Text variant="label" className="flex-1" numberOfLines={2}>
                    {e.name}
                  </Text>
                  <IconBtn label={t('custom.remove')} onPress={() => update(items.filter((_, k) => k !== i))}>
                    <Icon as={Trash} size={18} className="text-destructive" />
                  </IconBtn>
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <IconBtn
                      label={t('custom.shorter')}
                      disabled={it.durationSec <= 15}
                      onPress={() =>
                        update(
                          items.map((x, k) =>
                            k === i ? { ...x, durationSec: Math.max(15, x.durationSec - 15) } : x
                          )
                        )
                      }
                    >
                      <Icon as={Minus} size={16} weight="bold" />
                    </IconBtn>
                    <Text variant="label" className="min-w-[64px] text-center">
                      {formatDuration(it.durationSec, t)}
                    </Text>
                    <IconBtn
                      label={t('custom.longer')}
                      onPress={() =>
                        update(items.map((x, k) => (k === i ? { ...x, durationSec: x.durationSec + 15 } : x)))
                      }
                    >
                      <Icon as={Plus} size={16} weight="bold" />
                    </IconBtn>
                  </View>
                  <View className="flex-row gap-2">
                    <IconBtn label={t('custom.moveUp')} disabled={i === 0} onPress={() => move(i, -1)}>
                      <Icon as={ArrowUp} size={16} weight="bold" />
                    </IconBtn>
                    <IconBtn
                      label={t('custom.moveDown')}
                      disabled={i === items.length - 1}
                      onPress={() => move(i, 1)}
                    >
                      <Icon as={ArrowDown} size={16} weight="bold" />
                    </IconBtn>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <HeroActions />

      <GlassCard
        strong
        radii={{ tl: 28, tr: 28 }}
        style={{ position: 'absolute', start: 0, end: 0, bottom: 0 }}
        contentStyle={{
          flexDirection: 'row',
          gap: 12,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 12),
        }}
      >
        <Button
          variant="destructive"
          onPress={() => {
            remove(routine.id);
            toast.info(t('custom.deleted'));
            safeBack();
          }}
        >
          <Text>{t('custom.delete')}</Text>
        </Button>
        <Button
          className="flex-1"
          disabled={items.length === 0}
          onPress={() => {
            save({ ...routine, name: name.trim() || routine.name });
            startSession(`custom:${routine.id}`);
          }}
        >
          <Text>{t('custom.start')}</Text>
        </Button>
      </GlassCard>
    </View>
  );
}
