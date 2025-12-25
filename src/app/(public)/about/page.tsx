import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About Us - Sandra & Jan | Easy to Cook Meals",
  description: "Meet Sandra and Jan - a couple who met in Berlin, now living in Cyprus, traveling the world and sharing easy, delicious recipes from their adventures.",
  openGraph: {
    title: "About Sandra & Jan | Easy to Cook Meals",
    description: "Two food lovers sharing recipes from their travels around the world - from Cyprus to New York, Tel Aviv to Barcelona.",
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-parchment grain-texture">
      {/* Shared Header with Logo */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-terracotta-50 via-parchment to-sand-50 py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Two profile placeholders */}
          <div className="flex justify-center gap-6 mb-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-warm-xl border-4 border-white bg-gradient-to-br from-terracotta-200 to-sage-200 flex items-center justify-center">
              <span className="text-6xl md:text-7xl">👩</span>
            </div>
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-warm-xl border-4 border-white bg-gradient-to-br from-sage-200 to-terracotta-200 flex items-center justify-center">
              <span className="text-6xl md:text-7xl">👨</span>
            </div>
          </div>

          <span className="handwritten-label mb-6 block text-terracotta-600">
            Home Base: Cyprus
          </span>

          <h1 className="text-5xl md:text-7xl font-display font-normal text-ink leading-tight mb-8">
            We're Sandra & Jan
          </h1>

          <p className="text-xl md:text-2xl text-ink-light leading-relaxed font-body max-w-2xl mx-auto">
            Two food lovers who met in Berlin, fell for each other, and now explore the world together—one recipe at a time.
          </p>
        </div>

        {/* Decorative warm elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-terracotta-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-sage-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="space-y-16">
          {/* Our Story Section */}
          <div className="bg-white rounded-organic p-8 md:p-12 shadow-warm-lg border border-sand-200">
            <h2 className="text-3xl md:text-4xl font-display text-ink mb-6">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none font-body text-ink-light space-y-6">
              <p className="text-lg leading-relaxed">
                We met in Berlin—a city that taught us how diverse and exciting food can be.
                From currywurst stands to Vietnamese pho joints, from Turkish bakeries to
                modern vegan restaurants, Berlin showed us that great food connects people
                across cultures and backgrounds.
              </p>

              <p className="text-lg leading-relaxed">
                We fell in love over shared meals and kitchen experiments. Eventually,
                we decided to trade the gray Berlin winters for something sunnier.
                We moved to Cyprus—our home base, where the Mediterranean sun warms
                our days and local markets overflow with fresh produce, olives, and herbs.
              </p>

              <p className="text-lg leading-relaxed">
                But we didn't stop exploring. From Cyprus, we travel the world together.
                We've wandered through the markets of Tel Aviv, savored tapas in Barcelona,
                discovered hidden gems in New York, and collected recipes everywhere we go.
              </p>
            </div>
          </div>

          {/* What We Share Section */}
          <div className="bg-gradient-to-br from-terracotta-50 via-sand-50 to-sage-50 rounded-organic p-8 md:p-12 shadow-warm border border-terracotta-100">
            <span className="handwritten-label mb-4 block">
              What This Blog Is About
            </span>
            <h2 className="text-3xl md:text-4xl font-display text-ink mb-6">
              Recipes From Our Travels
            </h2>
            <div className="space-y-6 font-body text-ink-light">
              <p className="text-lg leading-relaxed">
                This blog is our kitchen journal. We share recipes we've discovered on our travels,
                dishes we've tried and loved, meals we want to recreate, and our own creations
                inspired by the flavors we've encountered around the world.
              </p>

              <p className="text-lg leading-relaxed">
                Some recipes are authentic treasures—learned from locals who welcomed us
                into their kitchens. Others are our own twists on classics we've tasted.
                All of them are easy to make, because we believe great food shouldn't be complicated.
              </p>

              <p className="text-lg leading-relaxed">
                Whether it's a quick weeknight dinner, a special occasion feast, or
                something sweet to share with friends—we hope these recipes bring
                as much joy to your kitchen as they bring to ours.
              </p>
            </div>
          </div>

          {/* Places We've Been */}
          <div className="bg-white rounded-organic p-8 md:p-12 shadow-warm-lg border border-sand-200">
            <h2 className="text-3xl md:text-4xl font-display text-ink mb-6">
              Places That Inspire Us
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-body">
              {[
                { city: 'Berlin', emoji: '🇩🇪', note: 'Where we met' },
                { city: 'Cyprus', emoji: '🇨🇾', note: 'Home base' },
                { city: 'Tel Aviv', emoji: '🇮🇱', note: 'Market magic' },
                { city: 'Barcelona', emoji: '🇪🇸', note: 'Tapas heaven' },
                { city: 'New York', emoji: '🇺🇸', note: 'Food melting pot' },
                { city: 'Vienna', emoji: '🇦🇹', note: 'Café culture' },
                { city: 'Lisbon', emoji: '🇵🇹', note: 'Pastéis dreams' },
                { city: 'Bangkok', emoji: '🇹🇭', note: 'Street food' },
              ].map((place) => (
                <div key={place.city} className="text-center p-4 bg-sand-50 rounded-organic">
                  <span className="text-3xl block mb-2">{place.emoji}</span>
                  <span className="font-medium text-ink block">{place.city}</span>
                  <span className="text-sm text-ink-muted">{place.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quote Section */}
          <div className="text-center">
            <div className="p-8 bg-terracotta-50 rounded-organic border-l-4 border-terracotta-500 inline-block">
              <p className="text-xl md:text-2xl font-display text-ink italic">
                "The best recipes are the ones that tell a story—and we have plenty to share."
              </p>
              <p className="mt-4 text-ink-muted font-body">— Sandra & Jan</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-br from-sand-50 to-terracotta-50 rounded-organic p-8 md:p-12 shadow-warm border border-sand-200">
            <h2 className="text-3xl md:text-4xl font-display text-ink mb-6">
              Start Cooking With Us
            </h2>
            <p className="text-lg text-ink-light mb-8 font-body max-w-2xl mx-auto">
              Browse our collection of recipes from around the world.
              Each one comes with a story, easy instructions, and a whole lot of love.
            </p>
            <Link
              href="/recipes"
              className="btn-primary inline-flex items-center gap-3"
            >
              <span>Explore Recipes</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
