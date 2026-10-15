import { EmptyState } from '@/components/empty-state';
import type { KaiPose } from '@/characters/types';
import { useT } from '@/i18n';
import type { Mood } from '@/store/types';

export type EmptyKind =
  'favourites' | 'history' | 'downloads' | 'search' | 'custom' | 'mood' | 'achievements' | 'reminders';

/** One Kai mood + pose per situation, so the same case always feels the same everywhere. */
const LOOK: Record<EmptyKind, { mood: Mood; pose: KaiPose }> = {
  favourites: { mood: 'happy', pose: 'float' },
  history: { mood: 'happy', pose: 'wave' },
  downloads: { mood: 'calm', pose: 'float' },
  search: { mood: 'neutral', pose: 'float' },
  custom: { mood: 'happy', pose: 'wave' },
  mood: { mood: 'calm', pose: 'float' },
  achievements: { mood: 'happy', pose: 'celebrate' },
  reminders: { mood: 'happy', pose: 'bell' },
};

/**
 * Friendly empty state (ST-02): Kai, warm copy and a helpful action. `body` can be overridden when a screen
 * knows more (e.g. history with a filter on). Omit `onCta` to hide the button.
 */
export function EmptyFor({
  kind,
  onCta,
  body,
  className,
}: {
  kind: EmptyKind;
  onCta?: () => void;
  body?: string;
  className?: string;
}) {
  const { t } = useT();
  return (
    <EmptyState
      title={t(`states.empty.${kind}.title`)}
      body={body ?? t(`states.empty.${kind}.body`)}
      mood={LOOK[kind].mood}
      pose={LOOK[kind].pose}
      cta={onCta ? { label: t(`states.empty.${kind}.cta`), onPress: onCta } : undefined}
      className={className}
    />
  );
}
