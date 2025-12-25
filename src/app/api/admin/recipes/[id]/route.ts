import { NextRequest, NextResponse } from 'next/server';
import { deleteRecipe, getRecipeById, updateRecipe } from '@/lib/admin';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/admin/recipes/[id] - Get single recipe
export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const recipe = await getRecipeById(id);
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }
    return NextResponse.json(recipe);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/recipes/[id] - Update recipe
export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const data = await request.json();
    await updateRecipe(id, data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/recipes/[id] - Delete recipe
export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    await deleteRecipe(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
