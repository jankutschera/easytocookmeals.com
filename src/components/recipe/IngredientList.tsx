'use client';

import { IngredientGroup, Ingredient } from '@/types/recipe';
import { formatAmount, convertUnit } from '@/lib/unit-conversion';

// Extended type where ingredients are guaranteed to be present
type IngredientGroupWithIngredients = IngredientGroup & {
  ingredients: Ingredient[];
};

interface IngredientListProps {
  groups: IngredientGroupWithIngredients[];
  multiplier: number;
  useMetric: boolean;
  checkedIngredients: Set<string>;
  onToggleIngredient: (id: string) => void;
}

export function IngredientList({
  groups,
  multiplier,
  useMetric,
  checkedIngredients,
  onToggleIngredient,
}: IngredientListProps) {
  return (
    <div className="space-y-6" itemProp="recipeIngredient">
      {groups.map((group) => (
        <div key={group.id} className="space-y-3">
          {/* Group title */}
          {group.title && (
            <h4 className="font-medium text-gray-800 uppercase text-sm tracking-wide border-b border-gray-200 pb-2">
              {group.title}
            </h4>
          )}

          {/* Ingredients */}
          <ul className="space-y-2">
            {group.ingredients.map((ingredient) => {
              const isChecked = checkedIngredients.has(ingredient.id);
              const { amount, unit } = convertUnit(
                ingredient.amount ? ingredient.amount * multiplier : null,
                ingredient.unit,
                useMetric
              );

              return (
                <li
                  key={ingredient.id}
                  className={`flex items-start gap-3 p-2 -mx-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                    isChecked ? 'opacity-50' : ''
                  }`}
                  onClick={() => onToggleIngredient(ingredient.id)}
                >
                  {/* Checkbox */}
                  <div
                    className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isChecked
                        ? 'bg-terracotta-500 border-terracotta-500'
                        : 'border-gray-300 hover:border-terracotta-400'
                    }`}
                    role="checkbox"
                    aria-checked={isChecked}
                  >
                    {isChecked && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Ingredient text */}
                  <span className={`flex-1 ${isChecked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {amount && (
                      <span className="font-semibold text-gray-900">
                        {formatAmount(amount)}
                      </span>
                    )}
                    {unit && (
                      <span className="text-gray-600"> {unit}</span>
                    )}
                    <span> {ingredient.name}</span>
                    {ingredient.notes && (
                      <span className="text-gray-500 italic"> ({ingredient.notes})</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {/* Progress indicator */}
      {groups.length > 0 && (
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              {checkedIngredients.size} of{' '}
              {groups.reduce((acc, g) => acc + g.ingredients.length, 0)} checked
            </span>
            {checkedIngredients.size > 0 && (
              <span className="text-terracotta-500">
                {Math.round(
                  (checkedIngredients.size /
                    groups.reduce((acc, g) => acc + g.ingredients.length, 0)) *
                    100
                )}
                % ready
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
