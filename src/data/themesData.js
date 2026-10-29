import { Zap, Flame, Compass, Sun } from 'lucide-react';

export const THEMES = [
  {
    id: 'olympic-clean',
    name: 'Swiss Clean',
    subtitle: 'On Running / Minimalist Performance',
    isLight: true,
    accent: '#0055FF',
    accentSecondary: '#10B981',
    contrastText: '#FFFFFF',
    badgeText: 'Light • Minimal',
    icon: Compass,
    description: 'Crisp pure white, electric cobalt, refined typography, and sleek Swiss-engineered athletic minimalism.'
  },
  {
    id: 'sunrise-coral',
    name: 'Sunrise Stride',
    subtitle: 'Nike Run Club / Radiant Dawn',
    isLight: true,
    accent: '#FF4800',
    accentSecondary: '#F59E0B',
    contrastText: '#FFFFFF',
    badgeText: 'Light • Radiant',
    icon: Sun,
    description: 'Warm morning dawn energy, radiant coral and amber tones, celebrating 5:30 AM sunrise runners.'
  },
  {
    id: 'kinetic',
    name: 'Kinetic Volt',
    subtitle: 'Asymmetric Bento Cockpit',
    isLight: false,
    accent: '#CCFF00',
    accentSecondary: '#FF3B30',
    contrastText: '#000000',
    badgeText: 'Dark • Bento',
    icon: Zap,
    description: 'Deep carbon obsidian with asymmetrical bento cards, neon volt glows, and live telemetry cockpits.'
  },
  {
    id: 'crimson',
    name: 'Crimson Velocity',
    subtitle: 'Breaking2 Speed Runway',
    isLight: false,
    accent: '#FF1E42',
    accentSecondary: '#FF7700',
    contrastText: '#FFFFFF',
    badgeText: 'Dark • Speed',
    icon: Flame,
    description: 'Pitch stealth black with angled velocity ribbons, milestone distance progression, and marathon race telemetry.'
  }
];
