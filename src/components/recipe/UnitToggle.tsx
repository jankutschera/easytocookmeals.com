'use client';

interface UnitToggleProps {
  useMetric: boolean;
  onToggle: (useMetric: boolean) => void;
}

export function UnitToggle({ useMetric, onToggle }: UnitToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-700 font-medium text-sm">Units:</span>
      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        <button
          onClick={() => onToggle(true)}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            useMetric
              ? 'bg-terracotta-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
          aria-pressed={useMetric}
        >
          Metric
        </button>
        <button
          onClick={() => onToggle(false)}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            !useMetric
              ? 'bg-terracotta-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
          aria-pressed={!useMetric}
        >
          US
        </button>
      </div>
    </div>
  );
}
