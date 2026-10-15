import { router, type Href } from 'expo-router';
import { View } from 'react-native';

import { Character } from '@/characters/character';
import { AuroraBackground } from '@/components/aurora-background';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';

/** Reusable "Coming soon" (ST-03) so no button is ever a dead end. Optional title names the destination. */
export function ComingSoon({ title, onBack }: { title?: string; onBack?: () => void }) {
  const { t } = useT();
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
      <AuroraBackground />
      <Character name="kai" pose="float" mood="calm" size={150} />
      <View className="items-center gap-1.5">
        <Text variant="title1" className="text-center" accessibilityRole="header">
          {title ?? t('comingSoon.title')}
        </Text>
        <Text variant="bodyLarge" className="text-center text-muted-foreground">
          {t('comingSoon.body')}
        </Text>
      </View>
      <Button size="lg" onPress={onBack ?? (() => router.replace('/home' as Href))}>
        <Text>{t('comingSoon.cta')}</Text>
      </Button>
    </View>
  );
}
