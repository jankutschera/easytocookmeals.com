'use client';

interface ServingsAdjusterProps {
  servings: number;
  originalServings: number;
  onServingsChange: (servings: number) => void;
  servingsUnit: string;
}

export function ServingsAdjuster({
  servings,
  originalServings,
  onServingsChange,
  servingsUnit,
}: ServingsAdjusterProps) {
  const presets = [2, 4, 6, 8, 12];
  const isScaled = servings !== originalServings;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-gray-700 font-medium">Servings:</span>

      {/* Quick preset buttons */}
      <div className="flex items-center gap-1">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => onServingsChange(preset)}
            className={`w-10 h-10 rounded-lg font-medium transition-all ${
              servings === preset
                ? 'bg-terracotta-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-terracotta-50 hover:text-terracotta-600 border border-gray-200'
            }`}
            aria-label={`Set servings to ${preset}`}
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onServingsChange(Math.max(1, servings - 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Decrease servings"
        >
          −
        </button>
        <input
          type="number"
          value={servings}
          onChange={(e) => onServingsChange(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-16 h-10 text-center border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 outline-none"
          min={1}
          max={100}
          aria-label="Custom servings"
        />
        <button
          onClick={() => onServingsChange(servings + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Increase servings"
        >
          +
        </button>
      </div>

      <span className="text-gray-500">{servingsUnit}</span>

      {/* Reset button when scaled */}
      {isScaled && (
        <button
          onClick={() => onServingsChange(originalServings)}
          className="text-sm text-terracotta-600 hover:text-terracotta-700 underline"
        >
          Reset to {originalServings}
        </button>
      )}
    </div>
  );
}
