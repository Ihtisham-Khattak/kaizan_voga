import { WarningCircle } from 'phosphor-react-native';
import { View } from 'react-native';

import { Character } from '@/characters/character';
import { AuroraBackground } from '@/components/aurora-background';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';

/** Full-screen error (ST-03): Kai looks tired, the message is kind and blames nobody, one clear Retry. */
export function ErrorState({
  title,
  body,
  onRetry,
  retryLabel,
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  const { t } = useT();
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
      <AuroraBackground />
      <Character name="kai" pose="float" mood="tired" size={150} />
      <View className="items-center gap-1.5">
        <Text variant="title1" className="text-center" accessibilityRole="header">
          {title ?? t('states.error.title')}
        </Text>
        <Text variant="bodyLarge" className="text-center text-muted-foreground">
          {body ?? t('states.error.body')}
        </Text>
      </View>
      {onRetry ? (
        <Button size="lg" onPress={onRetry}>
          <Text>{retryLabel ?? t('common.retry')}</Text>
        </Button>
      ) : null}
    </View>
  );
}

/** Inline error row for a card or list that failed to load, with a retry that does not leave the screen. */
export function InlineError({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const { t } = useT();
  return (
    <View
      accessible
      accessibilityRole="alert"
      className="flex-row items-center gap-3 rounded-card border border-hairline bg-bgMist p-4"
    >
      <Icon as={WarningCircle} size={24} weight="duotone" className="text-muted-foreground" />
      <Text variant="body" className="flex-1">
        {message ?? t('states.inline')}
      </Text>
      {onRetry ? (
        <Button size="sm" variant="secondary" onPress={onRetry}>
          <Text>{t('common.retry')}</Text>
        </Button>
      ) : null}
    </View>
  );
}
