import Link from "next/link";

interface RecipePageProps {
  params: {
    slug: string;
  };
}

export default function RecipePage({ params }: RecipePageProps) {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-cream border-b border-warmGray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-2xl font-heading font-bold text-warmGray-900 hover:text-coral">
            Easy to Cook Meals
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-12 rounded-lg border border-warmGray-200">
          <h1 className="text-4xl font-heading font-bold text-warmGray-900 mb-4">
            Recipe: {params.slug}
          </h1>
          <p className="text-warmGray-600">
            Individual recipe page placeholder. Recipe content will be loaded from the database.
          </p>
        </div>
      </main>
    </div>
  );
}
