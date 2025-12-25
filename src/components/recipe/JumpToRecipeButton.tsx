'use client';

export function JumpToRecipeButton() {
  const scrollToRecipe = () => {
    const recipeCard = document.getElementById('recipe-card');
    if (recipeCard) {
      recipeCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      onClick={scrollToRecipe}
      className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta-500 text-white font-semibold rounded-full hover:bg-terracotta-600 transition-colors shadow-lg hover:shadow-xl"
      aria-label="Jump to recipe"
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
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
      Jump to Recipe
    </button>
  );
}
