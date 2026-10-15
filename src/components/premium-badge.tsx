import { Lock } from 'phosphor-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useEntitlement, type GateTarget } from '@/lib/entitlement';
import { useT } from '@/i18n';
import { cn } from '@/lib/utils';

type ContentTarget = Extract<GateTarget, { kind: 'content' }>;

/**
 * Small lock + "Premium" pill for content that is locked for this user. Renders nothing once they have Premium,
 * and nothing for content that is never locked (starter session, breathing, quick relief).
 */
export function PremiumBadge({ className, ...target }: Omit<ContentTarget, 'kind'> & { className?: string }) {
  const { t } = useT();
  const { allowed } = useEntitlement({ kind: 'content', ...target });
  if (allowed) return null;
  return (
    <View
      accessible
      accessibilityLabel={t('cards.premium')}
      className={cn(
        'flex-row items-center gap-1 self-start rounded-pill border border-hairline bg-bg/95 px-2 py-1',
        className
      )}
    >
      <Icon as={Lock} size={12} weight="bold" />
      <Text variant="footnote" className="font-sans-semibold text-foreground">
        {t('cards.premium')}
      </Text>
    </View>
  );
}
