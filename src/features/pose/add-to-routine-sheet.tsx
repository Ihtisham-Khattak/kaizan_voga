import { Plus } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { BottomSheet } from '@/components/bottom-sheet';
import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { addPoseToRoutine, createCustomRoutine } from '@/lib/routines';
import { useLibraryStore } from '@/store/library-store';

/** "Add to custom routine": pick one of your routines, or create a new one and add the pose to it. */
export function AddToRoutineSheet({
  visible,
  onClose,
  exerciseId,
}: {
  visible: boolean;
  onClose: () => void;
  exerciseId: string;
}) {
  const { t } = useT();
  const routines = useLibraryStore((s) => s.customRoutines);
  const [name, setName] = useState('');

  const add = (id: string, routineName: string) => {
    addPoseToRoutine(id, exerciseId);
    toast.success(t('pose.sheet.added', { name: routineName }));
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={t('pose.sheet.title')}
      snapPoints={[480]}
      scrollable
    >
      {routines.length === 0 ? (
        <Text variant="body" className="text-muted-foreground">
          {t('pose.sheet.empty')}
        </Text>
      ) : null}
      <View className="gap-2">
        {routines.map((r) => (
          <Pressable
            key={r.id}
            onPress={() => add(r.id, r.name)}
            accessibilityRole="button"
            accessibilityLabel={`${r.name}, ${t('pose.sheet.poses', { count: r.items.length })}`}
            className="min-h-14 flex-row items-center justify-between gap-3 rounded-2xl bg-secondary px-4 active:opacity-80"
          >
            <View className="flex-1">
              <Text variant="label">{r.name}</Text>
              <Text variant="caption">{t('pose.sheet.poses', { count: r.items.length })}</Text>
            </View>
            <Icon as={Plus} size={20} weight="bold" className="text-primary" />
          </Pressable>
        ))}
      </View>
      <View className="gap-2 pt-2">
        <Input
          value={name}
          onChangeText={setName}
          placeholder={t('pose.sheet.createPh')}
          accessibilityLabel={t('pose.sheet.createPh')}
        />
        <Button
          variant="outline"
          onPress={() => {
            const r = createCustomRoutine(name || t('pose.sheet.defaultName'));
            setName('');
            add(r.id, r.name);
          }}
        >
          <Icon as={Plus} size={16} weight="bold" />
          <Text>{t('pose.sheet.create')}</Text>
        </Button>
      </View>
    </BottomSheet>
  );
}
