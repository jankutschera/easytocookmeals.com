import { MetadataRoute } from 'next';
import { createServerClient } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://easytocookmeals.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/recipes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic recipe pages
  const supabase = createServerClient();
  let recipePages: MetadataRoute.Sitemap = [];

  if (supabase) {
    const { data: recipes } = await supabase
      .from('recipes')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });

    if (recipes) {
      recipePages = recipes.map((recipe) => ({
        url: `${baseUrl}/recipe/${recipe.slug}`,
        lastModified: new Date(recipe.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  }

  // Cuisine pages
  const cuisines = ['italian', 'mexican', 'asian', 'mediterranean', 'indian', 'american'];
  const cuisinePages: MetadataRoute.Sitemap = cuisines.map((cuisine) => ({
    url: `${baseUrl}/cuisine/${cuisine}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...recipePages, ...cuisinePages];
}
