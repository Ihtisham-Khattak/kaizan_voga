import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider, type Theme } from 'expo-router';
import { useColorScheme as useNativeWindScheme } from 'nativewind';
import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme as useSystemScheme } from 'react-native';

import { useAppStore } from '@/store';

import { darkTokens, lightTokens, type Tokens } from './tokens';

interface ThemeValue {
  scheme: 'light' | 'dark';
  isDark: boolean;
  tokens: Tokens;
}

const ThemeContext = createContext<ThemeValue>({ scheme: 'light', isDark: false, tokens: lightTokens });

/**
 * Resolves light | dark | system from the persisted preference, keeps NativeWind's
 * `dark:` classes + CSS variables in sync, and feeds React Navigation the Kaizen palette.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const preference = useAppStore((s) => s.theme);
  const system = useSystemScheme();
  const { setColorScheme } = useNativeWindScheme();

  const scheme: 'light' | 'dark' =
    preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;

  useEffect(() => {
    setColorScheme(scheme);
  }, [scheme, setColorScheme]);

  const value = useMemo<ThemeValue>(
    () => ({ scheme, isDark: scheme === 'dark', tokens: scheme === 'dark' ? darkTokens : lightTokens }),
    [scheme]
  );

  const navTheme = useMemo<Theme>(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    const t = value.tokens;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: t.primary,
        background: t.background,
        card: t.card,
        text: t.foreground,
        border: t.border,
        notification: t.coral,
      },
    };
  }, [scheme, value.tokens]);

  return (
    <ThemeContext.Provider value={value}>
      <NavThemeProvider value={navTheme}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        {children}
      </NavThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
