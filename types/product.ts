export type Product = {
  id: number;
  title: string;
  description: string;
  vendor: string;
  product_type: string;
  price: number;
  tags?: string[];
  url?: string;
  outOfStock?: boolean;
};

export interface SearchFilters {
  category: string
  priceRange: [number, number]
  rating: number
  inStock: boolean
}

export interface SortOption {
  value: string
  label: string
}
