export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  discount: number;
  original_price?: number;
  imageUrl: string;
  gallery: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  color: string;
  specifications: Record<string, string>;
  feature_vector?: number[];
}

export interface SimilarityBreakdown {
  overall: number;
  colorMatch: number;
  shapeMatch: number;
  textureMatch: number;
}

export interface MatchResult {
  product: Product;
  similarityPercentage: number;
  confidenceScore: number;
  breakdown: SimilarityBreakdown;
}

export interface VisualSearchResponse {
  queryImage: string;
  topMatches: MatchResult[];
  detectedCategory: string;
  processingTimeMs: number;
  totalCatalogSize: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface SearchHistoryItem {
  id: string;
  timestamp: string;
  queryImageUrl: string;
  topMatchName: string;
  similarity: number;
}

export interface AnalyticsData {
  totalVisualSearches: number;
  avgMatchConfidence: number;
  catalogItemsCount: number;
  activeCategories: number;
  popularCategories: {
    category: string;
    count: number;
    percentage: number;
  }[];
}
