import Link from "next/link";
import { getAllRecipesAdmin } from '@/lib/admin';
import { RecipeList } from '@/components/admin/RecipeList';
import { AdminStats } from '@/components/admin/AdminStats';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const recipes = await getAllRecipesAdmin();

  const stats = {
    total: recipes.length,
    published: recipes.filter((r) => r.status === 'published').length,
    drafts: recipes.filter((r) => r.status === 'draft').length,
    archived: recipes.filter((r) => r.status === 'archived').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-heading font-bold text-gray-900">
                Recipe Dashboard
              </h1>
              <p className="text-gray-500">Manage your Easy To Cook Meals recipes</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-coral-500"
              >
                View Site
              </Link>
              <Link
                href="/admin/new"
                className="inline-flex items-center px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Recipe
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <AdminStats stats={stats} />

        {/* Bot Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <h3 className="font-medium text-blue-900">Telegram Bot</h3>
              <p className="text-sm text-blue-700">
                Use the Telegram bot to import recipes from URLs or paste recipe text.
                Run <code className="bg-blue-100 px-1 rounded">npm run bot</code> to start.
              </p>
            </div>
          </div>
        </div>

        {/* Recipe List */}
        <div className="mt-8">
          <RecipeList recipes={recipes} />
        </div>
      </main>
    </div>
  );
}
