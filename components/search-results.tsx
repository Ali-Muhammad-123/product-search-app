import { Grid, List, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import type { Product } from "@/types/product";
import { useState, useEffect, useMemo } from "react";

interface SearchResultsProps {
  products: Product[];
  query: string;
  totalProducts: number;
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 20;

export function SearchResults({
  products,
  query,
  totalProducts,
  isLoading,
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const pageCount = Math.ceil(products.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return products.slice(start, start + ITEMS_PER_PAGE);
  }, [products, currentPage]);

  const goToPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToNext = () => setCurrentPage((p) => Math.min(pageCount, p + 1));

  // Reset page if query or products change
  useEffect(() => {
    setCurrentPage(1);
  }, [products, query]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="border-b-2 border-blue-600 rounded-full w-8 h-8 animate-spin"></div>
        <span className="ml-2 text-gray-600">Searching products...</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <Package className="mx-auto mb-4 w-16 h-16 text-gray-400" />
        <h3 className="mb-2 font-semibold text-gray-900 text-xl">
          No products found
        </h3>
        <p className="mb-4 text-gray-600">
          {query
            ? `No products match your search for "${query}"`
            : "No products match your current filters"}
        </p>
        <p className="text-gray-500 text-sm">
          Try adjusting your search terms or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">
          Showing {paginatedProducts.length} of {products.length} products
          {query && (
            <span className="font-normal text-gray-600"> for "{query}"</span>
          )}
        </h2>

        {/* View Mode */}
        <div className="flex items-center gap-1 p-1 border rounded-lg">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="p-0 w-8 h-8"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="p-0 w-8 h-8"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Product List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6"
            : "space-y-4"
        }
      >
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} viewMode={viewMode} />
        ))}
      </div>

      {/* Pagination Controls */}
      {pageCount > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6">
          <Button disabled={currentPage === 1} onClick={goToPrev}>
            Previous
          </Button>
          <span className="text-gray-600 text-sm">
            Page {currentPage} of {pageCount}
          </span>
          <Button disabled={currentPage === pageCount} onClick={goToNext}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
