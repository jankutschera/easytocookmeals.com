'use client';

import { Instruction } from '@/types/recipe';

interface InstructionStepsProps {
  instructions: Instruction[];
  checkedSteps: Set<number>;
  onToggleStep: (stepNumber: number) => void;
}

export function InstructionSteps({
  instructions,
  checkedSteps,
  onToggleStep,
}: InstructionStepsProps) {
  const sortedInstructions = [...instructions].sort(
    (a, b) => a.step_number - b.step_number
  );

  return (
    <ol className="space-y-6">
      {sortedInstructions.map((instruction, idx) => {
        const isChecked = checkedSteps.has(instruction.step_number);
        const isNext = !isChecked &&
          sortedInstructions
            .slice(0, idx)
            .every((i) => checkedSteps.has(i.step_number));

        return (
          <li
            key={instruction.id}
            className={`relative pl-14 transition-opacity ${
              isChecked ? 'opacity-50' : ''
            }`}
          >
            {/* Step number circle */}
            <button
              onClick={() => onToggleStep(instruction.step_number)}
              className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                isChecked
                  ? 'bg-green-500 text-white'
                  : isNext
                  ? 'bg-terracotta-500 text-white ring-4 ring-terracotta-100'
                  : 'bg-gray-100 text-gray-600 hover:bg-terracotta-50 hover:text-terracotta-600'
              }`}
              aria-label={isChecked ? 'Mark step as incomplete' : 'Mark step as complete'}
            >
              {isChecked ? (
                <svg
                  className="w-5 h-5"
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
              ) : (
                instruction.step_number
              )}
            </button>

            {/* Step content */}
            <div className="space-y-3">
              <p
                className={`text-gray-700 leading-relaxed ${
                  isChecked ? 'line-through text-gray-400' : ''
                }`}
              >
                {instruction.text}
              </p>

              {/* Step image */}
              {instruction.image_url && (
                <img
                  src={instruction.image_url}
                  alt={`Step ${instruction.step_number}`}
                  className="rounded-lg w-full max-w-md shadow-sm"
                />
              )}

              {/* Step tip */}
              {instruction.tip && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-amber-500 flex-shrink-0">💡</span>
                  <p className="text-sm text-amber-800">{instruction.tip}</p>
                </div>
              )}
            </div>

            {/* Connecting line */}
            {idx < sortedInstructions.length - 1 && (
              <div className="absolute left-5 top-12 bottom-0 w-px bg-gray-200 -translate-x-1/2" />
            )}
          </li>
        );
      })}

      {/* Completion celebration */}
      {instructions.length > 0 &&
        instructions.every((i) => checkedSteps.has(i.step_number)) && (
          <li className="pl-14 py-6 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-full font-medium">
              <span className="text-2xl">🎉</span>
              Recipe Complete!
            </div>
          </li>
        )}
    </ol>
  );
}
