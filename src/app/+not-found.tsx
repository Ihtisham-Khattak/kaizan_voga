import { router, type Href } from 'expo-router';

import { ErrorState } from '@/features/states/error-state';
import { useT } from '@/i18n';

/** Unknown URL: a kind page instead of the framework's "Unmatched Route". */
export default function NotFound() {
  const { t } = useT();
  return (
    <ErrorState
      title={t('states.notFound.title')}
      body={t('states.notFound.body')}
      retryLabel={t('comingSoon.cta')}
      onRetry={() => router.replace('/' as Href)}
    />
  );
}
