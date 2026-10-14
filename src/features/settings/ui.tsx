import { CaretRight, Minus, Plus } from 'phosphor-react-native';
import { I18nManager, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ComponentProps, ReactNode } from 'react';

import { ScreenHeader } from '@/components/screen-header';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { addMinutes, formatClock } from '@/lib/format';
import { weekdayLabel, weekdayOrder } from '@/lib/weekdays';
import type { Weekday } from '@/store/types';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';

type PhosphorIcon = ComponentProps<typeof Icon>['as'];

/** Shared page for every settings / info screen: header + scrollable body with safe-area padding. */
export function SettingsScreen({
  title,
  subtitle,
  children,
  keyboard,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  keyboard?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        keyboardShouldPersistTaps={keyboard ? 'handled' : undefined}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40, gap: 24 }}
      >
        <ScreenHeader title={title} subtitle={subtitle} />
        {children}
      </ScrollView>
    </View>
  );
}

/** A titled card holding rows. */
export function Group({ title, footer, children }: { title?: string; footer?: string; children: ReactNode }) {
  return (
    <View className="gap-2 px-4">
      {title ? (
        <Text variant="label" accessibilityRole="header" className="px-1 text-muted-foreground">
          {title}
        </Text>
      ) : null}
      <View className="overflow-hidden rounded-3xl border border-border bg-card">{children}</View>
      {footer ? (
        <Text variant="caption" className="px-1">
          {footer}
        </Text>
      ) : null}
    </View>
  );
}

const rowBase = 'min-h-14 flex-row items-center gap-3 px-4 py-3';

/** One tappable (or static) line inside a Group. */
export function Row({
  icon,
  label,
  sub,
  right,
  onPress,
  danger,
  first,
  chevron = true,
}: {
  icon?: PhosphorIcon;
  label: string;
  sub?: string;
  right?: ReactNode;
  onPress?: () => void;
  danger?: boolean;
  first?: boolean;
  chevron?: boolean;
}) {
  const content = (
    <>
      {icon ? (
        <View className="size-10 items-center justify-center rounded-full bg-secondary">
          <Icon
            as={icon}
            size={20}
            weight="duotone"
            className={danger ? 'text-destructive' : 'text-primary'}
          />
        </View>
      ) : null}
      <View className="flex-1">
        <Text variant="label" className={danger ? 'text-destructive' : undefined}>
          {label}
        </Text>
        {sub ? <Text variant="caption">{sub}</Text> : null}
      </View>
      {right}
      {onPress && chevron ? (
        <Icon
          as={CaretRight}
          size={18}
          className="text-muted-foreground"
          style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
        />
      ) : null}
    </>
  );
  const border = first ? '' : 'border-t border-border';
  if (!onPress)
    return (
      <View className={cn(rowBase, border)} accessible accessibilityLabel={sub ? `${label}. ${sub}` : label}>
        {content}
      </View>
    );
  return (
    <Pressable
      onPress={() => {
        haptic.select();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={sub ? `${label}. ${sub}` : label}
      className={cn(rowBase, border, 'active:bg-secondary/50')}
    >
      {content}
    </Pressable>
  );
}

/** Row with a switch. The whole row toggles (the switch itself is small). */
export function SwitchRow({
  icon,
  label,
  sub,
  value,
  onChange,
  first,
  disabled,
}: {
  icon?: PhosphorIcon;
  label: string;
  sub?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  first?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={() => {
        haptic.select();
        onChange(!value);
      }}
      disabled={disabled}
      role="switch"
      aria-checked={value}
      accessibilityLabel={sub ? `${label}. ${sub}` : label}
      accessibilityState={{ checked: value, disabled }}
      className={cn(rowBase, first ? '' : 'border-t border-border', disabled && 'opacity-50')}
    >
      {icon ? (
        <View className="size-10 items-center justify-center rounded-full bg-secondary">
          <Icon as={icon} size={20} weight="duotone" className="text-primary" />
        </View>
      ) : null}
      <View className="flex-1">
        <Text variant="label">{label}</Text>
        {sub ? <Text variant="caption">{sub}</Text> : null}
      </View>
      <View pointerEvents="none">
        <Switch checked={value} onCheckedChange={() => {}} accessibilityLabel={label} />
      </View>
    </Pressable>
  );
}

/** A labelled single-choice row of chips. */
export function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
  first,
  sub,
}: {
  label: string;
  sub?: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  first?: boolean;
}) {
  return (
    <View className={cn('gap-2 px-4 py-3', first ? '' : 'border-t border-border')}>
      <View>
        <Text variant="label" accessibilityRole="header">
          {label}
        </Text>
        {sub ? <Text variant="caption">{sub}</Text> : null}
      </View>
      <View role="radiogroup" accessibilityLabel={label} className="flex-row flex-wrap gap-2">
        {options.map((o) => (
          <Chip key={String(o.id)} label={o.label} selected={value === o.id} onPress={() => onChange(o.id)} />
        ))}
      </View>
    </View>
  );
}

/** ± stepper for a clock time ("08:00"), in 15-minute steps. */
export function TimeStepper({
  label,
  value,
  onChange,
  step = 15,
  first,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  step?: number;
  first?: boolean;
}) {
  const { t, i18n } = useT();
  const btn = 'size-11 items-center justify-center rounded-full bg-secondary active:opacity-80';
  return (
    <View className={cn(rowBase, first ? '' : 'border-t border-border')}>
      <Text variant="label" className="flex-1">
        {label}
      </Text>
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={() => {
            haptic.select();
            onChange(addMinutes(value, -step));
          }}
          accessibilityRole="button"
          accessibilityLabel={`${label}: ${t('pf.rem.earlier')}`}
          className={btn}
        >
          <Icon as={Minus} size={18} weight="bold" className="text-secondary-foreground" />
        </Pressable>
        <Text variant="heading" className="min-w-[92px] text-center" accessibilityLiveRegion="polite">
          {formatClock(value, i18n.language)}
        </Text>
        <Pressable
          onPress={() => {
            haptic.select();
            onChange(addMinutes(value, step));
          }}
          accessibilityRole="button"
          accessibilityLabel={`${label}: ${t('pf.rem.later')}`}
          className={btn}
        >
          <Icon as={Plus} size={18} weight="bold" className="text-secondary-foreground" />
        </Pressable>
      </View>
    </View>
  );
}

/** Seven round day buttons in the device's week order. Selected = filled; labelled with the full weekday for screen readers. */
export function DayPicker({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: Weekday[];
  onToggle: (d: Weekday) => void;
}) {
  const { i18n } = useT();
  return (
    <View className="gap-2 border-t border-border px-4 py-3">
      <Text variant="label" accessibilityRole="header">
        {label}
      </Text>
      <View className="flex-row justify-between" role="group" accessibilityLabel={label}>
        {weekdayOrder().map((iso) => {
          const on = value.includes(iso);
          return (
            <Pressable
              key={iso}
              role="checkbox"
              aria-checked={on}
              accessibilityLabel={weekdayLabel(iso, 'long', i18n.language)}
              accessibilityState={{ checked: on }}
              onPress={() => {
                haptic.select();
                onToggle(iso);
              }}
              className={cn(
                'size-11 items-center justify-center rounded-full border-2',
                on ? 'border-primary bg-primary' : 'border-border bg-card'
              )}
            >
              <Text variant="label" className={on ? 'text-primary-foreground' : 'text-foreground'}>
                {weekdayLabel(iso, 'narrow', i18n.language)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
