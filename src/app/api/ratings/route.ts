import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipeId, rating, comment } = body;

    // Validate input
    if (!recipeId || !rating) {
      return NextResponse.json(
        { error: 'Recipe ID and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Insert rating
    const { data, error } = await supabase
      .from('ratings')
      .insert({
        recipe_id: recipeId,
        rating,
        comment: comment || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Rating insert error:', error);
      return NextResponse.json(
        { error: 'Failed to submit rating' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, rating: data });
  } catch (error) {
    console.error('Rating API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const recipeId = searchParams.get('recipeId');

  if (!recipeId) {
    return NextResponse.json(
      { error: 'Recipe ID is required' },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  // Get ratings for recipe
  const { data: ratings, error } = await supabase
    .from('ratings')
    .select('*')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Ratings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }

  // Calculate average
  const average =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

  return NextResponse.json({
    ratings,
    average: Math.round(average * 10) / 10,
    count: ratings.length,
  });
}
