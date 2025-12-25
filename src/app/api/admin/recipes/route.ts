import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// POST /api/admin/recipes - Create new recipe
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const supabase = createServerClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Ensure unique slug
    const slug = await ensureUniqueSlug(supabase, data.slug);

    const { data: recipe, error } = await supabase
      .from('recipes')
      .insert({
        slug,
        title: data.title,
        description: data.description || null,
        story: data.story || null,
        prep_time_minutes: data.prep_time_minutes || null,
        cook_time_minutes: data.cook_time_minutes || null,
        servings: data.servings || 4,
        servings_unit: data.servings_unit || 'servings',
        cuisine: data.cuisine || [],
        course: data.course || [],
        keywords: data.keywords || [],
        featured_image_url: data.featured_image_url || null,
        status: data.status || 'draft',
      })
      .select()
      .single();

    if (error) {
      console.error('Create recipe error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(recipe, { status: 201 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function ensureUniqueSlug(supabase: any, baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data } = await supabase
      .from('recipes')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!data) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;

    if (counter > 100) {
      throw new Error('Could not generate unique slug');
    }
  }
}
