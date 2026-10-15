import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora-background';
import { TAB_BAR_CLEARANCE } from '@/components/tab-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { useT } from '@/i18n';

/** Shared frame: background, safe area, and a polite "loading" announcement for screen readers. */
function Frame({ children, tabs }: { children: ReactNode; tabs?: boolean }) {
  const { t } = useT();
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-background" accessible accessibilityLabel={t('states.loading')} aria-busy>
      <AuroraBackground />
      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: tabs ? TAB_BAR_CLEARANCE : insets.bottom + 24,
          paddingHorizontal: 16,
          gap: 20,
        }}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const Row = ({ h = 72 }: { h?: number }) => <Skeleton style={{ height: h }} className="w-full" />;

export function HomeSkeleton() {
  return (
    <Frame tabs>
      <View className="flex-row items-center justify-between">
        <View className="gap-2">
          <Skeleton className="rounded-input h-8 w-56" />
          <Skeleton className="rounded-input h-4 w-36" />
        </View>
        <Skeleton className="size-12 rounded-full" />
      </View>
      <Row h={120} />
      <Skeleton className="h-60 w-full rounded-hero" />
      <View className="flex-row gap-3">
        <Skeleton className="h-28 flex-1" />
        <Skeleton className="h-28 flex-1" />
        <Skeleton className="h-28 flex-1" />
      </View>
    </Frame>
  );
}

export function ExploreSkeleton() {
  return (
    <Frame tabs>
      <Skeleton className="rounded-input h-8 w-32" />
      <Skeleton className="h-12 w-full rounded-pill" />
      <View className="flex-row gap-2">
        <Skeleton className="h-11 w-24 rounded-pill" />
        <Skeleton className="h-11 w-20 rounded-pill" />
        <Skeleton className="h-11 w-28 rounded-pill" />
      </View>
      <Skeleton className="h-52 w-full" />
      <Row />
      <Row />
    </Frame>
  );
}

/** Pose, routine and program detail: hero, title, chips, a few lines and a list. */
export function DetailSkeleton() {
  return (
    <Frame>
      <Skeleton className="-mx-4 h-64 rounded-hero" />
      <Skeleton className="rounded-input h-8 w-64" />
      <View className="flex-row gap-2">
        <Skeleton className="h-8 w-20 rounded-pill" />
        <Skeleton className="h-8 w-24 rounded-pill" />
        <Skeleton className="h-8 w-16 rounded-pill" />
      </View>
      <Skeleton className="rounded-input h-4 w-full" />
      <Skeleton className="rounded-input h-4 w-5/6" />
      <Row />
      <Row />
    </Frame>
  );
}

export function ProgressSkeleton() {
  return (
    <Frame tabs>
      <Skeleton className="rounded-input h-8 w-48" />
      <Skeleton className="h-72 w-full" />
      <View className="flex-row gap-3">
        <Skeleton className="h-20 flex-1" />
        <Skeleton className="h-20 flex-1" />
        <Skeleton className="h-20 flex-1" />
      </View>
    </Frame>
  );
}

export function ProfileSkeleton() {
  return (
    <Frame tabs>
      <View className="items-center gap-3">
        <Skeleton className="size-24 rounded-full" />
        <Skeleton className="rounded-input h-8 w-40" />
      </View>
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-32 w-full" />
      <Row />
    </Frame>
  );
}

export function ListSkeleton() {
  return (
    <Frame>
      <Skeleton className="rounded-input h-8 w-40" />
      <View className="flex-row gap-2">
        <Skeleton className="h-11 w-16 rounded-pill" />
        <Skeleton className="h-11 w-24 rounded-pill" />
        <Skeleton className="h-11 w-24 rounded-pill" />
      </View>
      {[0, 1, 2, 3, 4].map((i) => (
        <Row key={i} h={64} />
      ))}
    </Frame>
  );
}
