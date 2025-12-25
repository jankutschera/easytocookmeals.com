/**
 * Unit conversion utilities for recipe ingredients
 * Supports Metric ↔ US conversions
 */

// Conversion rates (to metric)
const CONVERSIONS: Record<string, { metricUnit: string; metricRate: number }> = {
  // Volume
  cup: { metricUnit: 'ml', metricRate: 236.588 },
  cups: { metricUnit: 'ml', metricRate: 236.588 },
  tablespoon: { metricUnit: 'ml', metricRate: 14.787 },
  tablespoons: { metricUnit: 'ml', metricRate: 14.787 },
  tbsp: { metricUnit: 'ml', metricRate: 14.787 },
  teaspoon: { metricUnit: 'ml', metricRate: 4.929 },
  teaspoons: { metricUnit: 'ml', metricRate: 4.929 },
  tsp: { metricUnit: 'ml', metricRate: 4.929 },
  'fluid ounce': { metricUnit: 'ml', metricRate: 29.574 },
  'fl oz': { metricUnit: 'ml', metricRate: 29.574 },
  pint: { metricUnit: 'ml', metricRate: 473.176 },
  quart: { metricUnit: 'ml', metricRate: 946.353 },
  gallon: { metricUnit: 'l', metricRate: 3.785 },

  // Weight
  ounce: { metricUnit: 'g', metricRate: 28.35 },
  ounces: { metricUnit: 'g', metricRate: 28.35 },
  oz: { metricUnit: 'g', metricRate: 28.35 },
  pound: { metricUnit: 'g', metricRate: 453.592 },
  pounds: { metricUnit: 'g', metricRate: 453.592 },
  lb: { metricUnit: 'g', metricRate: 453.592 },
  lbs: { metricUnit: 'g', metricRate: 453.592 },

  // Already metric - no conversion
  g: { metricUnit: 'g', metricRate: 1 },
  gram: { metricUnit: 'g', metricRate: 1 },
  grams: { metricUnit: 'g', metricRate: 1 },
  kg: { metricUnit: 'kg', metricRate: 1 },
  kilogram: { metricUnit: 'kg', metricRate: 1 },
  ml: { metricUnit: 'ml', metricRate: 1 },
  milliliter: { metricUnit: 'ml', metricRate: 1 },
  l: { metricUnit: 'l', metricRate: 1 },
  liter: { metricUnit: 'l', metricRate: 1 },
};

// Reverse conversions (metric to US)
const REVERSE_CONVERSIONS: Record<string, { usUnit: string; usRate: number }> = {
  ml: { usUnit: 'tbsp', usRate: 1 / 14.787 },
  l: { usUnit: 'cups', usRate: 4.227 },
  g: { usUnit: 'oz', usRate: 1 / 28.35 },
  kg: { usUnit: 'lbs', usRate: 2.205 },
};

// Fraction display for common values
const FRACTIONS: Record<number, string> = {
  0.125: '⅛',
  0.25: '¼',
  0.333: '⅓',
  0.375: '⅜',
  0.5: '½',
  0.625: '⅝',
  0.666: '⅔',
  0.75: '¾',
  0.875: '⅞',
};

/**
 * Format a numeric amount to a readable string with fractions
 */
export function formatAmount(amount: number | null): string {
  if (amount === null || amount === undefined) return '';

  // Handle whole numbers
  if (Number.isInteger(amount)) {
    return amount.toString();
  }

  const whole = Math.floor(amount);
  const decimal = amount - whole;

  // Find closest fraction
  let closestFraction = '';
  let minDiff = 0.1;

  for (const [value, symbol] of Object.entries(FRACTIONS)) {
    const diff = Math.abs(decimal - parseFloat(value));
    if (diff < minDiff) {
      minDiff = diff;
      closestFraction = symbol;
    }
  }

  if (closestFraction) {
    return whole > 0 ? `${whole} ${closestFraction}` : closestFraction;
  }

  // Fall back to decimal
  return amount.toFixed(1).replace(/\.0$/, '');
}

/**
 * Convert between metric and US units
 */
export function convertUnit(
  amount: number | null | undefined,
  unit: string | null | undefined,
  useMetric: boolean
): { amount: number | null; unit: string | null } {
  if (amount === null || amount === undefined || !unit) {
    return { amount: amount ?? null, unit: unit ?? null };
  }

  const normalizedUnit = unit.toLowerCase().trim();

  if (useMetric) {
    // Convert to metric
    const conversion = CONVERSIONS[normalizedUnit];
    if (conversion && conversion.metricRate !== 1) {
      let newAmount = amount * conversion.metricRate;
      let newUnit = conversion.metricUnit;

      // Simplify large ml to l
      if (newUnit === 'ml' && newAmount >= 1000) {
        newAmount = newAmount / 1000;
        newUnit = 'l';
      }

      // Simplify large g to kg
      if (newUnit === 'g' && newAmount >= 1000) {
        newAmount = newAmount / 1000;
        newUnit = 'kg';
      }

      return { amount: newAmount, unit: newUnit };
    }
  } else {
    // Convert to US
    const reverseConversion = REVERSE_CONVERSIONS[normalizedUnit];
    if (reverseConversion) {
      let newAmount = amount * reverseConversion.usRate;
      let newUnit = reverseConversion.usUnit;

      // Simplify large tbsp to cups
      if (newUnit === 'tbsp' && newAmount >= 16) {
        newAmount = newAmount / 16;
        newUnit = 'cups';
      }

      // Simplify small cups to tbsp
      if (newUnit === 'cups' && newAmount < 0.25) {
        newAmount = newAmount * 16;
        newUnit = 'tbsp';
      }

      return { amount: newAmount, unit: newUnit };
    }
  }

  // No conversion available, return as-is
  return { amount, unit };
}

/**
 * Smart unit display - handles pluralization
 */
export function displayUnit(unit: string, amount: number): string {
  const singularUnits: Record<string, string> = {
    cups: 'cup',
    tablespoons: 'tablespoon',
    teaspoons: 'teaspoon',
    ounces: 'ounce',
    pounds: 'pound',
    grams: 'gram',
    liters: 'liter',
    milliliters: 'milliliter',
  };

  const pluralUnits: Record<string, string> = {
    cup: 'cups',
    tablespoon: 'tablespoons',
    teaspoon: 'teaspoons',
    ounce: 'ounces',
    pound: 'pounds',
    gram: 'grams',
    liter: 'liters',
    milliliter: 'milliliters',
  };

  const normalizedUnit = unit.toLowerCase();

  if (amount === 1) {
    return singularUnits[normalizedUnit] || unit;
  } else {
    return pluralUnits[normalizedUnit] || unit;
  }
}
