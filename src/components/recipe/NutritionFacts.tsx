'use client';

import { Nutrition } from '@/types/recipe';

interface NutritionFactsProps {
  nutrition: Nutrition;
  servingsMultiplier?: number;
}

export function NutritionFacts({ nutrition, servingsMultiplier = 1 }: NutritionFactsProps) {
  const scale = (value: number | null | undefined) => {
    if (value === null || value === undefined) return null;
    return Math.round(value * servingsMultiplier);
  };

  const formatValue = (value: number | null | undefined, unit: string) => {
    if (value === null || value === undefined) return '-';
    return `${scale(value)}${unit}`;
  };

  const nutrients = [
    { label: 'Calories', value: nutrition.calories, unit: '', highlight: true },
    { label: 'Total Carbs', value: nutrition.carbs_g, unit: 'g' },
    { label: 'Protein', value: nutrition.protein_g, unit: 'g' },
    { label: 'Total Fat', value: nutrition.fat_g, unit: 'g' },
    { label: 'Saturated Fat', value: nutrition.saturated_fat_g, unit: 'g', indent: true },
    { label: 'Fiber', value: nutrition.fiber_g, unit: 'g' },
    { label: 'Sugar', value: nutrition.sugar_g, unit: 'g' },
    { label: 'Sodium', value: nutrition.sodium_mg, unit: 'mg' },
  ];

  const vitamins = [
    { label: 'Vitamin A', value: nutrition.vitamin_a_iu, unit: 'IU' },
    { label: 'Vitamin C', value: nutrition.vitamin_c_mg, unit: 'mg' },
    { label: 'Calcium', value: nutrition.calcium_mg, unit: 'mg' },
    { label: 'Iron', value: nutrition.iron_mg, unit: 'mg' },
    { label: 'Potassium', value: nutrition.potassium_mg, unit: 'mg' },
  ].filter(v => v.value !== null && v.value !== undefined);

  return (
    <section
      className="bg-white border-2 border-gray-900 rounded-xl p-6 max-w-md"
      itemProp="nutrition"
      itemScope
      itemType="https://schema.org/NutritionInformation"
    >
      <h3 className="font-heading text-2xl text-gray-900 border-b-8 border-gray-900 pb-2 mb-2">
        Nutrition Facts
      </h3>

      {nutrition.serving_size && (
        <p className="text-sm text-gray-600 border-b border-gray-300 pb-2 mb-2">
          Per serving: {nutrition.serving_size}
          {servingsMultiplier !== 1 && (
            <span className="text-terracotta-600 ml-2">
              (scaled ×{servingsMultiplier.toFixed(1)})
            </span>
          )}
        </p>
      )}

      {/* Main nutrients */}
      <div className="space-y-1 border-b-4 border-gray-900 pb-2 mb-2">
        {nutrients.map((nutrient) => (
          <div
            key={nutrient.label}
            className={`flex justify-between py-1 ${
              nutrient.highlight
                ? 'font-bold text-lg border-b border-gray-300'
                : nutrient.indent
                ? 'pl-4 text-sm'
                : ''
            }`}
          >
            <span className="text-gray-700">{nutrient.label}</span>
            <span className={nutrient.highlight ? 'text-gray-900' : 'text-gray-600'}>
              {formatValue(nutrient.value, nutrient.unit)}
            </span>
          </div>
        ))}
      </div>

      {/* Vitamins and minerals */}
      {vitamins.length > 0 && (
        <div className="grid grid-cols-2 gap-2 text-sm">
          {vitamins.map((vitamin) => (
            <div key={vitamin.label} className="flex justify-between text-gray-600">
              <span>{vitamin.label}</span>
              <span>{formatValue(vitamin.value, vitamin.unit)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Schema.org metadata */}
      <meta itemProp="calories" content={`${nutrition.calories || 0} calories`} />
      <meta itemProp="carbohydrateContent" content={`${nutrition.carbs_g || 0} g`} />
      <meta itemProp="proteinContent" content={`${nutrition.protein_g || 0} g`} />
      <meta itemProp="fatContent" content={`${nutrition.fat_g || 0} g`} />
      <meta itemProp="fiberContent" content={`${nutrition.fiber_g || 0} g`} />
      <meta itemProp="sodiumContent" content={`${nutrition.sodium_mg || 0} mg`} />
      <meta itemProp="sugarContent" content={`${nutrition.sugar_g || 0} g`} />
    </section>
  );
}
