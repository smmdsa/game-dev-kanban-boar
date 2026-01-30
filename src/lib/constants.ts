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
 * Colores para los puntos Fibonacci con progresión clara de dificultad
 * 1 = Verde (muy fácil) → 89 = Violeta (extremadamente difícil)
 * Progresión: Verde → Amarillo → Naranja → Rojo → Azul → Violeta
 */
export function getFibonacciPointColor(value: number): { bg: string; border: string; text: string } {
  const colorMap: Record<number, { bg: string; border: string; text: string }> = {
    0: {
      bg: 'oklch(0.50 0.02 260)',
      border: 'oklch(0.40 0.02 260)',
      text: 'oklch(0.98 0 0)',
    },
    1: {
      // Verde brillante - Muy fácil
      bg: 'oklch(0.70 0.20 145)',
      border: 'oklch(0.55 0.20 145)',
      text: 'oklch(0.98 0 0)',
    },
    2: {
      // Verde claro
      bg: 'oklch(0.68 0.18 135)',
      border: 'oklch(0.53 0.18 135)',
      text: 'oklch(0.98 0 0)',
    },
    3: {
      // Verde-Amarillo
      bg: 'oklch(0.75 0.18 120)',
      border: 'oklch(0.60 0.18 120)',
      text: 'oklch(0.15 0 0)',
    },
    5: {
      // Amarillo - Moderado
      bg: 'oklch(0.80 0.18 95)',
      border: 'oklch(0.65 0.18 95)',
      text: 'oklch(0.15 0 0)',
    },
    8: {
      // Naranja claro
      bg: 'oklch(0.75 0.20 70)',
      border: 'oklch(0.60 0.20 70)',
      text: 'oklch(0.15 0 0)',
    },
    13: {
      // Naranja - Difícil
      bg: 'oklch(0.70 0.22 50)',
      border: 'oklch(0.55 0.22 50)',
      text: 'oklch(0.98 0 0)',
    },
    21: {
      // Rojo - Muy difícil
      bg: 'oklch(0.60 0.24 30)',
      border: 'oklch(0.45 0.24 30)',
      text: 'oklch(0.98 0 0)',
    },
    34: {
      // Azul - Complejo
      bg: 'oklch(0.55 0.22 250)',
      border: 'oklch(0.40 0.22 250)',
      text: 'oklch(0.98 0 0)',
    },
    55: {
      // Azul-Violeta
      bg: 'oklch(0.52 0.24 270)',
      border: 'oklch(0.37 0.24 270)',
      text: 'oklch(0.98 0 0)',
    },
    89: {
      // Violeta fuerte - Extremadamente difícil
      bg: 'oklch(0.48 0.26 290)',
      border: 'oklch(0.33 0.26 290)',
      text: 'oklch(0.98 0 0)',
    },
  };

  return colorMap[value] || colorMap[0];
}
