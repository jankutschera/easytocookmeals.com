interface RecipeMetaProps {
  prepTime?: number | null;
  cookTime?: number | null;
  restTime?: number | null;
  totalTime: number;
  servings?: number | null;
  cuisine?: string[] | null;
  course?: string[] | null;
}

function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function RecipeMeta({
  prepTime,
  cookTime,
  restTime,
  totalTime,
  servings,
  cuisine,
  course,
}: RecipeMetaProps) {
  const timeItems = [
    { label: 'Prep', value: prepTime, icon: '🔪' },
    { label: 'Cook', value: cookTime, icon: '🍳' },
    { label: 'Rest', value: restTime, icon: '⏳' },
  ].filter((item) => item.value && item.value > 0);

  return (
    <div className="flex flex-wrap gap-4">
      {/* Time badges */}
      <div className="flex flex-wrap items-center gap-3">
        {timeItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 px-3 py-2 bg-sand-50 rounded-lg border border-sand-200"
          >
            <span>{item.icon}</span>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                {item.label}
              </div>
              <div className="font-semibold text-gray-900">
                {formatTime(item.value!)}
              </div>
            </div>
          </div>
        ))}

        {/* Total time - highlighted */}
        {totalTime > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-terracotta-50 rounded-lg border border-terracotta-200">
            <span>⏱️</span>
            <div>
              <div className="text-xs text-terracotta-600 uppercase tracking-wide font-medium">
                Total
              </div>
              <div className="font-bold text-terracotta-700">
                {formatTime(totalTime)}
              </div>
            </div>
          </div>
        )}

        {/* Servings */}
        {servings && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <span>👥</span>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Servings
              </div>
              <div className="font-semibold text-gray-900">{servings}</div>
            </div>
          </div>
        )}
      </div>

      {/* Category badges */}
      <div className="flex flex-wrap items-center gap-2">
        {cuisine?.map((c) => (
          <span
            key={c}
            className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full"
          >
            {c}
          </span>
        ))}
        {course?.map((c) => (
          <span
            key={c}
            className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
