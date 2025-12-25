'use client';

import { Recipe } from '@/types/recipe';

interface PrintButtonProps {
  recipe: Recipe;
}

export function PrintButton({ recipe }: PrintButtonProps) {
  const handlePrint = () => {
    // Add print-specific class to body
    document.body.classList.add('printing-recipe');
    window.print();
    document.body.classList.remove('printing-recipe');
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-terracotta-600 hover:bg-terracotta-50 rounded-lg transition-colors"
      title="Print recipe"
      aria-label="Print this recipe"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
        />
      </svg>
      <span className="hidden sm:inline">Print</span>
    </button>
  );
}
