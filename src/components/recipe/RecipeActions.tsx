'use client';

import { useState, useEffect } from 'react';

interface RecipeActionsProps {
  title: string;
  url: string;
  recipeId: string;
}

export function RecipeActions({ title, url, recipeId }: RecipeActionsProps) {
  const [saved, setSaved] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // Check if recipe is saved in localStorage
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    setSaved(savedRecipes.includes(recipeId));

    // Check if Web Share API is available
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, [recipeId]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this recipe: ${title}`,
          url: url,
        });
      } catch (err) {
        // User cancelled or error - fall back to copy
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSave = () => {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');

    if (saved) {
      // Remove from saved
      const updated = savedRecipes.filter((id: string) => id !== recipeId);
      localStorage.setItem('savedRecipes', JSON.stringify(updated));
      setSaved(false);
    } else {
      // Add to saved
      savedRecipes.push(recipeId);
      localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
      setSaved(true);
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {/* Share Button */}
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-6 py-3 bg-ink hover:bg-terracotta-600 text-white font-body font-medium rounded-organic transition-all hover:shadow-warm-lg"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        {showSavedMessage && !saved ? 'Link Copied!' : 'Share'}
      </button>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className={`inline-flex items-center gap-2 px-6 py-3 font-body font-medium rounded-organic transition-all border-2 ${
          saved
            ? 'bg-terracotta-50 text-terracotta-700 border-terracotta-300'
            : 'bg-white hover:bg-terracotta-50 text-ink border-sand-300 hover:border-terracotta-300'
        }`}
      >
        <svg
          className="w-5 h-5"
          fill={saved ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        {saved ? 'Saved!' : 'Save'}
      </button>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-terracotta-50 text-ink font-body font-medium rounded-organic transition-all border-2 border-sand-300 hover:border-terracotta-300"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print
      </button>
    </div>
  );
}
