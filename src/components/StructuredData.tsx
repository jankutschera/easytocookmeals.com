/**
 * Structured Data (JSON-LD) component for SEO
 * Provides rich snippets for search engines
 */

export function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Easy to Cook Meals",
    "url": "https://easytocookmeals.com",
    "description": "Authentic vegan recipes from Nora, a digital nomad chef. Plant-based cooking made easy with Middle Eastern flavors and global inspiration.",
    "author": {
      "@type": "Person",
      "name": "Nora",
      "jobTitle": "Vegan Chef",
      "description": "Digital nomad and passionate vegan chef traveling the world, discovering new ingredients and sharing the ease and joy of plant-based cooking.",
      "url": "https://easytocookmeals.com/about",
      "sameAs": [
        "https://instagram.com/easytocookmeals",
        "https://pinterest.com/easytocookmeals"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Easy to Cook Meals",
      "logo": {
        "@type": "ImageObject",
        "url": "https://easytocookmeals.com/images/brand/logo.png",
        "width": 400,
        "height": 140
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://easytocookmeals.com/recipes?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function PersonStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Nora",
    "jobTitle": "Vegan Chef & Digital Nomad",
    "description": "Digital nomad and passionate vegan chef traveling the world, discovering new ingredients and techniques. Sharing the ease and joy of plant-based cooking, no matter where you are.",
    "url": "https://easytocookmeals.com/about",
    "image": "https://easytocookmeals.com/images/brand/logo.png",
    "sameAs": [
      "https://instagram.com/easytocookmeals",
      "https://pinterest.com/easytocookmeals"
    ],
    "knowsAbout": [
      "Vegan Cooking",
      "Plant-Based Recipes",
      "Middle Eastern Cuisine",
      "Israeli Cuisine",
      "Mediterranean Food",
      "Recipe Development",
      "Food Photography"
    ],
    "alumniOf": "Tel Aviv",
    "homeLocation": {
      "@type": "Place",
      "name": "Digital Nomad (Traveling)"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function RecipeCollectionStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Vegan Recipes Collection",
    "description": "A curated collection of authentic vegan recipes from around the world, featuring Middle Eastern flavors and plant-based cooking techniques.",
    "url": "https://easytocookmeals.com/recipes",
    "author": {
      "@type": "Person",
      "name": "Nora"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Easy to Cook Meals",
      "logo": {
        "@type": "ImageObject",
        "url": "https://easytocookmeals.com/images/brand/logo.png"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
