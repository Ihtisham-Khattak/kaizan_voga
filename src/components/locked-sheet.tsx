import { router, type Href } from 'expo-router';
import { View } from 'react-native';

import { Character } from '@/characters/character';
import { BottomSheet } from '@/components/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { useUiStore } from '@/store/ui-store';

/**
 * "This is part of Premium" – opened by `gate()` when someone taps locked content. One calm line, two buttons,
 * never a guilt trip. Mounted once at the root.
 */
export function LockedSheetHost() {
  const { t } = useT();
  const locked = useUiStore((s) => s.locked);
  const close = useUiStore((s) => s.closeLocked);

  return (
    <BottomSheet visible={locked !== null} onClose={close} hideClose>
      <View className="items-center gap-3">
        <Character name="kai" pose="float" mood="calm" size={96} />
        <Text variant="title2" className="text-center" accessibilityRole="header">
          {t('premium.locked.title')}
        </Text>
        <Text variant="body" className="text-center text-muted-foreground">
          {locked ? t(`premium.locked.${locked}`) : ''}
        </Text>
      </View>
      <Button
        size="lg"
        onPress={() => {
          close();
          router.push('/premium' as Href);
        }}
      >
        <Text>{t('premium.locked.seePremium')}</Text>
      </Button>
      <Button variant="ghost" onPress={close}>
        <Text>{t('premium.locked.notNow')}</Text>
      </Button>
    </BottomSheet>
  );
}
