export type RecipeStatus = 'draft' | 'published' | 'archived';

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description?: string;
  story?: string;

  // Timing
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  rest_time_minutes?: number;

  // Servings
  servings: number;
  servings_unit: string;

  // Categorization
  cuisine?: string[];
  course?: string[];
  keywords?: string[];

  // Media
  featured_image_url?: string;
  pinterest_image_url?: string;
  gallery_urls?: string[];

  // SEO
  meta_title?: string;
  meta_description?: string;

  // Status
  status: RecipeStatus;
  published_at?: string;
  created_at: string;
  updated_at: string;

  // Relations (populated when needed)
  ingredient_groups?: IngredientGroup[];
  instructions?: Instruction[];
  nutrition?: Nutrition;
  equipment?: Equipment[];
  ratings?: Rating[];
  average_rating?: number;
  rating_count?: number;
}

export interface IngredientGroup {
  id: string;
  recipe_id: string;
  title?: string;
  sort_order: number;
  ingredients?: Ingredient[];
}

export interface Ingredient {
  id: string;
  group_id: string;
  amount?: number;
  unit?: string;
  name: string;
  notes?: string;
  sort_order: number;
}

export interface Instruction {
  id: string;
  recipe_id: string;
  step_number: number;
  text: string;
  image_url?: string;
  tip?: string;
}

export interface Nutrition {
  recipe_id: string;
  serving_size?: string;
  calories?: number;
  carbs_g?: number;
  protein_g?: number;
  fat_g?: number;
  saturated_fat_g?: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  vitamin_a_iu?: number;
  vitamin_c_mg?: number;
  calcium_mg?: number;
  iron_mg?: number;
  potassium_mg?: number;
}

export interface Equipment {
  id: string;
  recipe_id: string;
  name: string;
  affiliate_url?: string;
}

export interface Rating {
  id: string;
  recipe_id: string;
  user_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
}

// Helper types for forms and API
export type CreateRecipeInput = Omit<Recipe, 'id' | 'created_at' | 'updated_at' | 'ingredient_groups' | 'instructions' | 'nutrition' | 'equipment' | 'ratings' | 'average_rating' | 'rating_count'> & {
  ingredient_groups?: Omit<IngredientGroup, 'id' | 'recipe_id'>[];
  instructions?: Omit<Instruction, 'id' | 'recipe_id'>[];
  nutrition?: Omit<Nutrition, 'recipe_id'>;
  equipment?: Omit<Equipment, 'id' | 'recipe_id'>[];
};

export type UpdateRecipeInput = Partial<CreateRecipeInput>;

// Recipe with all relations populated
export type RecipeWithRelations = Recipe & {
  ingredient_groups: (IngredientGroup & { ingredients: Ingredient[] })[];
  instructions: Instruction[];
  nutrition?: Nutrition;
  equipment: Equipment[];
};
