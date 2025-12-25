'use client';

import { useState, useCallback } from 'react';
import { Recipe, IngredientGroup, Ingredient, Instruction, Nutrition } from '@/types/recipe';
import { PrintButton } from './PrintButton';
import { ShareButtons } from './ShareButtons';
import { ServingsAdjuster } from './ServingsAdjuster';
import { IngredientList } from './IngredientList';
import { InstructionSteps } from './InstructionSteps';
import { NutritionFacts } from './NutritionFacts';
import { RecipeRating } from './RecipeRating';
import { RecipeMeta } from './RecipeMeta';
import { JumpToRecipeButton } from './JumpToRecipeButton';
import { UnitToggle } from './UnitToggle';
import { CookMode } from './CookMode';
import { StoryContent } from './StoryContent';

// Type for ingredient groups with guaranteed ingredients array
type IngredientGroupWithIngredients = IngredientGroup & {
  ingredients: Ingredient[];
};

interface RecipeCardProps {
  recipe: Recipe;
  ingredientGroups: IngredientGroupWithIngredients[];
  instructions: Instruction[];
  nutrition: Nutrition | null;
  averageRating?: number;
  ratingCount?: number;
}

export function RecipeCard({
  recipe,
  ingredientGroups,
  instructions,
  nutrition,
  averageRating = 0,
  ratingCount = 0,
}: RecipeCardProps) {
  const [servings, setServings] = useState(recipe.servings || 4);
  const [useMetric, setUseMetric] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [showCookMode, setShowCookMode] = useState(false);

  const originalServings = recipe.servings || 4;
  const servingsMultiplier = servings / originalServings;

  const totalTime = (recipe.prep_time_minutes || 0) +
                   (recipe.cook_time_minutes || 0) +
                   (recipe.rest_time_minutes || 0);

  const toggleIngredient = useCallback((id: string) => {
    setCheckedIngredients(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleStep = useCallback((stepNumber: number) => {
    setCheckedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepNumber)) {
        next.delete(stepNumber);
      } else {
        next.add(stepNumber);
      }
      return next;
    });
  }, []);

  return (
    <article
      id="recipe-card"
      className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-4xl mx-auto"
      itemScope
      itemType="https://schema.org/Recipe"
    >
      {/* Hidden schema.org metadata */}
      <meta itemProp="name" content={recipe.title} />
      <meta itemProp="description" content={recipe.description || ''} />
      {recipe.featured_image_url && (
        <meta itemProp="image" content={recipe.featured_image_url} />
      )}
      <meta itemProp="prepTime" content={`PT${recipe.prep_time_minutes || 0}M`} />
      <meta itemProp="cookTime" content={`PT${recipe.cook_time_minutes || 0}M`} />
      <meta itemProp="totalTime" content={`PT${totalTime}M`} />
      <meta itemProp="recipeYield" content={`${recipe.servings} ${recipe.servings_unit || 'servings'}`} />
      {recipe.cuisine?.map((c, i) => (
        <meta key={i} itemProp="recipeCuisine" content={c} />
      ))}
      {recipe.course?.map((c, i) => (
        <meta key={i} itemProp="recipeCategory" content={c} />
      ))}

      {/* Header with image */}
      {recipe.featured_image_url && (
        <div className="relative aspect-video w-full">
          <img
            src={recipe.featured_image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      {/* Recipe content */}
      <div className="p-6 md:p-8 space-y-8">
        {/* Title and rating */}
        <header className="space-y-4">
          <h2 className="font-heading text-3xl md:text-4xl text-gray-900 leading-tight">
            {recipe.title}
          </h2>

          {recipe.description && (
            <p className="text-gray-600 text-lg leading-relaxed">
              {recipe.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <RecipeRating
              recipeId={recipe.id}
              averageRating={averageRating}
              ratingCount={ratingCount}
            />

            <div className="flex flex-wrap gap-2">
              {/* Start Cooking button */}
              <button
                onClick={() => setShowCookMode(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Cooking
              </button>
              <PrintButton recipe={recipe} />
              <ShareButtons
                title={recipe.title}
                url={typeof window !== 'undefined' ? window.location.href : ''}
                pinterestImage={recipe.pinterest_image_url || recipe.featured_image_url}
              />
            </div>
          </div>
        </header>

        {/* Time and category badges */}
        <RecipeMeta
          prepTime={recipe.prep_time_minutes}
          cookTime={recipe.cook_time_minutes}
          restTime={recipe.rest_time_minutes}
          totalTime={totalTime}
          servings={recipe.servings}
          cuisine={recipe.cuisine}
          course={recipe.course}
        />

        {/* Story section */}
        {recipe.story && (
          <section className="prose prose-lg max-w-none">
            <StoryContent content={recipe.story} />
          </section>
        )}

        {/* Servings adjuster and unit toggle */}
        <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-sand-50 rounded-xl border border-sand-200">
          <ServingsAdjuster
            servings={servings}
            originalServings={originalServings}
            onServingsChange={setServings}
            servingsUnit={recipe.servings_unit || 'servings'}
          />
          <UnitToggle useMetric={useMetric} onToggle={setUseMetric} />
        </div>

        {/* Two-column layout for ingredients and instructions */}
        <div className="grid lg:grid-cols-[350px_1fr] gap-8">
          {/* Ingredients */}
          <aside className="space-y-6">
            <h3 className="font-heading text-2xl text-gray-900 flex items-center gap-2">
              <span className="text-terracotta-500">🥗</span>
              Ingredients
            </h3>
            <IngredientList
              groups={ingredientGroups}
              multiplier={servingsMultiplier}
              useMetric={useMetric}
              checkedIngredients={checkedIngredients}
              onToggleIngredient={toggleIngredient}
            />
          </aside>

          {/* Instructions */}
          <section className="space-y-6">
            <h3 className="font-heading text-2xl text-gray-900 flex items-center gap-2">
              <span className="text-terracotta-500">👩‍🍳</span>
              Instructions
            </h3>
            <InstructionSteps
              instructions={instructions}
              checkedSteps={checkedSteps}
              onToggleStep={toggleStep}
            />
          </section>
        </div>

        {/* Nutrition facts */}
        {nutrition && (
          <NutritionFacts
            nutrition={nutrition}
            servingsMultiplier={servingsMultiplier}
          />
        )}

        {/* Recipe tips */}
        {instructions.some(i => i.tip) && (
          <section className="p-6 bg-amber-50 rounded-xl border border-amber-200">
            <h3 className="font-heading text-xl text-gray-900 mb-4 flex items-center gap-2">
              <span>💡</span>
              Chef's Tips
            </h3>
            <ul className="space-y-2 text-gray-700">
              {instructions
                .filter(i => i.tip)
                .map((i, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-amber-500">•</span>
                    {i.tip}
                  </li>
                ))}
            </ul>
          </section>
        )}

        {/* Keywords */}
        {recipe.keywords && recipe.keywords.length > 0 && (
          <footer className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
            {recipe.keywords.map((keyword, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
              >
                {keyword}
              </span>
            ))}
          </footer>
        )}
      </div>

      {/* Cook Mode modal */}
      {showCookMode && (
        <CookMode
          instructions={instructions}
          recipeTitle={recipe.title}
          onClose={() => setShowCookMode(false)}
        />
      )}
    </article>
  );
}
