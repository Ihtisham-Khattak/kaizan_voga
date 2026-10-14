import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider, type Theme } from 'expo-router';
import { useColorScheme as useNativeWindScheme, vars } from 'nativewind';
import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, useColorScheme as useSystemScheme } from 'react-native';

import { useAppStore } from '@/store';

import { extras, palettes, rgbChannels, type Extras, type Palette } from './colors';
import { makeShadows, type Shadows } from './shadows';
import { toTokens, type Tokens } from './tokens';

interface ThemeValue {
  /** 'dark' = the spec's "Night" mode. */
  scheme: 'light' | 'dark';
  isDark: boolean;
  /** Spec palette (colors.ts names): bg, bgMist, glass, leaf, sunrise … */
  colors: Palette;
  extras: Extras;
  shadows: Shadows;
  /** Legacy semantic names (background, card, secondary, sage …) derived from `colors`. */
  tokens: Tokens;
}

const build = (scheme: 'light' | 'dark', highContrast: boolean): ThemeValue => {
  const key = scheme === 'dark' ? 'night' : 'light';
  const base = palettes[key];
  // High contrast: secondary text becomes full ink, dividers become the old secondary-text grey.
  const colors: Palette = highContrast ? { ...base, muted: base.ink, hairline: base.muted } : base;
  return {
    scheme,
    isDark: scheme === 'dark',
    colors,
    extras: extras[key],
    shadows: makeShadows(colors, extras[key]),
    tokens: toTokens(colors, extras[key]),
  };
};

const ThemeContext = createContext<ThemeValue>(build('light', false));

/**
 * Resolves light | dark | system from the persisted preference, keeps NativeWind's
 * `dark:` classes + CSS variables in sync, and feeds React Navigation the Kaizen palette.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const preference = useAppStore((s) => s.theme);
  const highContrast = useAppStore((s) => s.highContrast);
  const system = useSystemScheme();
  const { setColorScheme } = useNativeWindScheme();

  const scheme: 'light' | 'dark' =
    preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;

  useEffect(() => {
    setColorScheme(scheme);
  }, [scheme, setColorScheme]);

  const value = useMemo(() => build(scheme, highContrast), [scheme, highContrast]);

  // Re-point the CSS variables className reads when high contrast changes the palette.
  const hcVars = useMemo(
    () =>
      highContrast
        ? vars({
            '--muted-foreground': rgbChannels(value.colors.muted),
            '--muted-text': rgbChannels(value.colors.muted),
            '--border': rgbChannels(value.colors.hairline),
            '--input': rgbChannels(value.colors.hairline),
            '--hairline': rgbChannels(value.colors.hairline),
          })
        : null,
    [highContrast, value.colors]
  );

  const navTheme = useMemo<Theme>(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    const c = value.colors;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: c.primary,
        background: c.bg,
        card: c.bgMist,
        text: c.ink,
        border: c.hairline,
        notification: c.sunrise,
      },
    };
  }, [scheme, value.colors]);

  return (
    <ThemeContext.Provider value={value}>
      <NavThemeProvider value={navTheme}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <View style={[{ flex: 1 }, hcVars]}>{children}</View>
      </NavThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
