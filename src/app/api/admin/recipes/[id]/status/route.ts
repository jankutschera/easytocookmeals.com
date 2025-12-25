import { NextRequest, NextResponse } from 'next/server';
import { updateRecipeStatus } from '@/lib/admin';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/admin/recipes/[id]/status - Update recipe status
export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const { status } = await request.json();

    if (!['draft', 'published', 'archived'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be draft, published, or archived.' },
        { status: 400 }
      );
    }

    await updateRecipeStatus(id, status);
    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
