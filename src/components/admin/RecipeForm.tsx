'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Recipe } from '@/types/recipe';

interface RecipeFormProps {
  recipe?: Recipe;
  mode: 'create' | 'edit';
}

export function RecipeForm({ recipe, mode }: RecipeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: recipe?.title || '',
    slug: recipe?.slug || '',
    description: recipe?.description || '',
    story: recipe?.story || '',
    prep_time_minutes: recipe?.prep_time_minutes || 0,
    cook_time_minutes: recipe?.cook_time_minutes || 0,
    servings: recipe?.servings || 4,
    servings_unit: recipe?.servings_unit || 'servings',
    cuisine: recipe?.cuisine?.join(', ') || '',
    course: recipe?.course?.join(', ') || '',
    keywords: recipe?.keywords?.join(', ') || '',
    featured_image_url: recipe?.featured_image_url || '',
    status: recipe?.status || 'draft',
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: mode === 'create' ? generateSlug(title) : prev.slug,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        prep_time_minutes: Number(formData.prep_time_minutes) || null,
        cook_time_minutes: Number(formData.cook_time_minutes) || null,
        servings: Number(formData.servings) || 4,
        cuisine: formData.cuisine ? formData.cuisine.split(',').map((s) => s.trim()).filter(Boolean) : [],
        course: formData.course ? formData.course.split(',').map((s) => s.trim()).filter(Boolean) : [],
        keywords: formData.keywords ? formData.keywords.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };

      const url = mode === 'create'
        ? '/api/admin/recipes'
        : `/api/admin/recipes/${recipe?.id}`;

      const method = mode === 'create' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save recipe');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              placeholder="e.g., Creamy Vegan Pasta"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              placeholder="creamy-vegan-pasta"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              placeholder="A short description for SEO..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Story
            </label>
            <textarea
              name="story"
              value={formData.story}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              placeholder="The backstory or introduction for this recipe..."
            />
          </div>
        </div>
      </div>

      {/* Timing & Servings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Timing & Servings</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prep Time (min)
            </label>
            <input
              type="number"
              name="prep_time_minutes"
              value={formData.prep_time_minutes}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cook Time (min)
            </label>
            <input
              type="number"
              name="cook_time_minutes"
              value={formData.cook_time_minutes}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Servings
            </label>
            <input
              type="number"
              name="servings"
              value={formData.servings}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <input
              type="text"
              name="servings_unit"
              value={formData.servings_unit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              placeholder="servings"
            />
          </div>
        </div>
      </div>

      {/* Categorization */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Categorization</h2>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cuisine (comma-separated)
            </label>
            <input
              type="text"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              placeholder="Italian, Mediterranean"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course (comma-separated)
            </label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              placeholder="Main Course, Dinner"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              placeholder="vegan, quick, healthy"
            />
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Media</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image URL
          </label>
          <input
            type="url"
            name="featured_image_url"
            value={formData.featured_image_url}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
            placeholder="https://..."
          />
          {formData.featured_image_url && (
            <img
              src={formData.featured_image_url}
              alt="Preview"
              className="mt-2 w-48 h-32 object-cover rounded-lg"
            />
          )}
        </div>
      </div>

      {/* Status */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Status</h2>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Recipe' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
