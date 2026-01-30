export const PRESET_COLORS = [
  { name: 'Purple', value: 'oklch(0.45 0.15 285)' },
  { name: 'Cyan', value: 'oklch(0.75 0.15 195)' },
  { name: 'Green', value: 'oklch(0.65 0.18 145)' },
  { name: 'Orange', value: 'oklch(0.70 0.15 50)' },
  { name: 'Pink', value: 'oklch(0.70 0.20 350)' },
  { name: 'Yellow', value: 'oklch(0.80 0.15 90)' },
  { name: 'Red', value: 'oklch(0.55 0.22 25)' },
  { name: 'Blue', value: 'oklch(0.55 0.20 250)' },
  { name: 'Teal', value: 'oklch(0.60 0.15 180)' },
  { name: 'Indigo', value: 'oklch(0.50 0.18 270)' },
];

export const TAG_COLORS = [
  { name: 'Art', color: 'oklch(0.70 0.20 350)' },
  { name: 'Programming', color: 'oklch(0.55 0.20 250)' },
  { name: 'Sound', color: 'oklch(0.70 0.15 50)' },
  { name: 'Design', color: 'oklch(0.45 0.15 285)' },
  { name: 'Bug', color: 'oklch(0.55 0.22 25)' },
  { name: 'Feature', color: 'oklch(0.65 0.18 145)' },
  { name: 'Testing', color: 'oklch(0.75 0.15 195)' },
  { name: 'Documentation', color: 'oklch(0.80 0.15 90)' },
];

export const PRIORITY_LEVELS = [
  { 
    value: 'critical' as const, 
    label: 'Critical', 
    color: 'oklch(0.55 0.22 25)',
    borderColor: 'oklch(0.45 0.22 25)',
  },
  { 
    value: 'high' as const, 
    label: 'High', 
    color: 'oklch(0.70 0.15 50)',
    borderColor: 'oklch(0.60 0.15 50)',
  },
  { 
    value: 'medium' as const, 
    label: 'Medium', 
    color: 'oklch(0.80 0.15 90)',
    borderColor: 'oklch(0.70 0.15 90)',
  },
  { 
    value: 'low' as const, 
    label: 'Low', 
    color: 'oklch(0.75 0.15 195)',
    borderColor: 'oklch(0.65 0.15 195)',
  },
];

export const FIBONACCI_POINTS = [
  { value: 0, label: '0' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 5, label: '5' },
  { value: 8, label: '8' },
  { value: 13, label: '13' },
  { value: 21, label: '21' },
  { value: 34, label: '34' },
  { value: 55, label: '55' },
  { value: 89, label: '89' },
] as const;

/**
 * Interpola el color para los puntos Fibonacci desde verde (1) a violeta fuerte (89)
 * Valor 0 es neutral (gris)
 */
export function getFibonacciPointColor(value: number): { bg: string; border: string; text: string } {
  // Valor 0 es neutral
  if (value === 0) {
    return {
      bg: 'oklch(0.5 0.01 260)',
      border: 'oklch(0.4 0.01 260)',
      text: 'oklch(0.98 0 0)',
    };
  }

  // Interpolación de 1 a 89
  const minValue = 1;
  const maxValue = 89;
  const t = (value - minValue) / (maxValue - minValue);

  // Verde simple (145°) a Violeta fuerte (285°)
  const startHue = 145; // Verde
  const endHue = 285;   // Violeta
  const hue = startHue + (endHue - startHue) * t;

  // Ajustar luminosidad y saturación para mejor contraste
  const lightness = 0.65 - t * 0.20; // De 0.65 a 0.45
  const chroma = 0.18 + t * 0.07;     // De 0.18 a 0.25

  return {
    bg: `oklch(${lightness} ${chroma} ${hue})`,
    border: `oklch(${lightness - 0.1} ${chroma} ${hue})`,
    text: 'oklch(0.98 0 0)',
  };
}
