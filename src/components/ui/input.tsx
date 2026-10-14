import { Platform, TextInput } from 'react-native';

import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';

type InputProps = React.ComponentProps<typeof TextInput> &
  React.RefAttributes<TextInput> & { invalid?: boolean };

function Input({ className, invalid, style, ...props }: InputProps) {
  const rtl = useAppStore((s) => s.language) === 'ur';
  return (
    <TextInput
      className={cn(
        'min-h-14 w-full flex-row items-center rounded-2xl border bg-card px-4 py-3 font-sans text-kz-body-large text-foreground',
        invalid ? 'border-destructive' : 'border-input focus:border-ring',
        props.editable === false && 'opacity-50',
        Platform.select({
          web: 'outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50',
          native: 'placeholder:text-muted-foreground/70',
        }),
        className
      )}
      aria-invalid={invalid}
      maxFontSizeMultiplier={1.3}
      textAlign={rtl ? 'right' : undefined}
      style={style}
      {...props}
    />
  );
}

export { Input };
