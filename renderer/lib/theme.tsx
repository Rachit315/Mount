'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'mount-theme';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  setTheme: () => {},
  toggle: () => {},
});

/**
 * Applies the theme class before paint (see the inline script in layout.tsx),
 * then keeps <html> and localStorage in sync with React state.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const tweenTimer = useRef<number | undefined>(undefined);

  // Adopt whatever the pre-paint script decided.
  useEffect(() => {
    const root = document.documentElement;
    setThemeState(root.classList.contains('dark') ? 'dark' : 'light');
  }, []);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;

    // Turn the crossfade on for the duration of the swap only — leaving it on
    // would put a 400ms tween on every hover in the app.
    root.classList.add('theme-transition');
    window.clearTimeout(tweenTimer.current);
    tweenTimer.current = window.setTimeout(
      () => root.classList.remove('theme-transition'),
      450,
    );

    root.classList.toggle('dark', next === 'dark');
    root.style.colorScheme = next;

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage may be unavailable — theme still applies for this session */
    }

    setThemeState(next);
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/** Runs before first paint to avoid a flash of the wrong theme. */
export const themeInitScript = `
(function(){
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    var root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    root.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;
