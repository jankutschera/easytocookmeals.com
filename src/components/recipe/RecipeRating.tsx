'use client';

import { useState } from 'react';

interface RecipeRatingProps {
  recipeId: string;
  averageRating: number;
  ratingCount: number;
  onRate?: (rating: number) => Promise<void>;
}

export function RecipeRating({
  recipeId,
  averageRating,
  ratingCount,
  onRate,
}: RecipeRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  const displayRating = hoverRating || userRating || averageRating;

  const handleRate = async (rating: number) => {
    if (hasRated || isSubmitting) return;

    setUserRating(rating);
    setIsSubmitting(true);

    try {
      // Submit rating to API
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId, rating }),
      });

      if (response.ok) {
        setHasRated(true);
      }

      if (onRate) {
        await onRate(rating);
      }
    } catch (err) {
      console.error('Failed to submit rating:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stars component (shared between rated and unrated states)
  const starsElement = (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayRating;
        const isHalf = star - 0.5 <= displayRating && star > displayRating;

        return (
          <button
            key={star}
            onMouseEnter={() => !hasRated && setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleRate(star)}
            disabled={hasRated || isSubmitting}
            className={`w-6 h-6 transition-transform ${
              !hasRated ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
            }`}
            aria-label={`Rate ${star} stars`}
          >
            <svg
              viewBox="0 0 24 24"
              fill={isFilled ? '#fb6a4a' : isHalf ? 'url(#half)' : 'none'}
              stroke="#fb6a4a"
              strokeWidth={1.5}
              className="w-full h-full"
            >
              <defs>
                <linearGradient id="half">
                  <stop offset="50%" stopColor="#fb6a4a" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );

  // Only add microdata when we have valid rating data
  // This prevents Google errors about missing ratingValue/ratingCount
  if (ratingCount > 0 && averageRating > 0) {
    return (
      <div
        className="flex items-center gap-3"
        itemProp="aggregateRating"
        itemScope
        itemType="https://schema.org/AggregateRating"
      >
        {starsElement}
        <div className="text-sm">
          {hasRated ? (
            <span className="text-green-600 font-medium">Thanks for rating!</span>
          ) : (
            <span className="text-gray-600">
              <span className="font-semibold text-gray-900" itemProp="ratingValue">
                {averageRating.toFixed(1)}
              </span>{' '}
              from{' '}
              <span itemProp="ratingCount">{ratingCount}</span>{' '}
              {ratingCount === 1 ? 'rating' : 'ratings'}
            </span>
          )}
        </div>
        <meta itemProp="bestRating" content="5" />
        <meta itemProp="worstRating" content="1" />
      </div>
    );
  }

  // No ratings yet - don't add microdata to avoid Google errors
  return (
    <div className="flex items-center gap-3">
      {starsElement}
      <div className="text-sm">
        {hasRated ? (
          <span className="text-green-600 font-medium">Thanks for rating!</span>
        ) : (
          <span className="text-gray-500">Be the first to rate!</span>
        )}
      </div>
    </div>
  );
}
