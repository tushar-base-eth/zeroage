export const lightTheme = {
  background: '0 0% 100%', // White
  foreground: '222.2 84% 4.9%', // Near black

  card: '0 0% 100%',
  cardForeground: '222.2 84% 4.9%',

  popover: '0 0% 100%',
  popoverForeground: '222.2 84% 4.9%',

  // Modern, colorful primary
  primary: '221 83% 53%', // Bright blue
  primaryForeground: '210 40% 98%',

  // Subtle secondary
  secondary: '210 40% 96.1%',
  secondaryForeground: '222.2 47.4% 11.2%',

  muted: '210 40% 96.1%',
  mutedForeground: '215.4 16.3% 46.9%',

  // Colorful accent
  accent: '262 83% 58%', // Purple
  accentForeground: '210 40% 98%',

  destructive: '0 84.2% 60.2%', // Red
  destructiveForeground: '210 40% 98%',

  border: '214.3 31.8% 91.4%',
  input: '214.3 31.8% 91.4%',
  ring: '221 83% 53%',

  radius: '0.5rem',
} as const;

export type Theme = typeof lightTheme;

// We can add more themes here later
export const themes = {
  light: lightTheme,
} as const;

export type ThemeType = keyof typeof themes;
