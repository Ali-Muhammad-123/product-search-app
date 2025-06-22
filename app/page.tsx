"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { SearchBar } from "@/components/search-bar";
import { FiltersPanel } from "@/components/filters-panel";
import { SortDropdown } from "@/components/sort-dropdown";
import { SearchResults } from "@/components/search-results";
import { useDebounce } from "@/hooks/use-debounce";
import type { Product, SearchFilters } from "@/types/product";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Partial<SearchFilters>>({});
  const [sortBy, setSortBy] = useState("relevance");
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const debouncedQuery = useDebounce(searchQuery, 400);
  const workerRef = useRef<Worker | null>(null);

  // --- Load CSV and initialize search worker
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/csv.csv");
        const csvText = await response.text();

        const csvWorker = new Worker("/csvWorker.js");
        const searchWorker = new Worker("/searchWorker.js");
        workerRef.current = searchWorker;

        csvWorker.postMessage(csvText);

        csvWorker.onmessage = (e) => {
          const parsed = e.data;
          setProducts(parsed);
          setIsLoading(false);
          searchWorker.postMessage({ type: "init", data: parsed });
        };

        searchWorker.onmessage = (e) => {
          if (e.data.type === "results") {
            const result = e.data.results;
            setSearchResults(result);
            setSuggestions(result.slice(0, 5).map((p: Product) => p.title));
          }
        };
      } catch (err) {
        console.error("Failed to load CSV:", err);
        setIsLoading(false);
      }
    };

    loadProducts();
    return () => workerRef.current?.terminate();
  }, []);

  // --- Trigger search via web worker
  useEffect(() => {
    if (!workerRef.current || !products.length) return;

    workerRef.current.postMessage({
      type: "search",
      data: {
        query: debouncedQuery,
        filters,
        sortBy,
      },
    });
  }, [debouncedQuery, filters, sortBy, products]);

  // --- Memoized price range
  const priceRange = useMemo<[number, number]>(() => {
    const prices = products.map((p) => p.price).filter((p) => !isNaN(p));
    if (!prices.length) return [0, 0];
    return [Math.min(...prices), Math.max(...prices)];
  }, [products]);

  // --- Handlers
  const handleSuggestionClick = useCallback((s: string) => {
    setSearchQuery(s);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="mx-auto mb-4 border-b-2 border-blue-600 rounded-full w-12 h-12 animate-spin"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-bold text-gray-900 text-4xl">
              Product Search
            </h1>
            <p className="text-gray-600 text-lg">
              Discover amazing products with our powerful search engine
            </p>
          </div>
          <div className="flex lg:flex-row flex-col justify-center items-center gap-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
              placeholder="Search by product name, vendor, description..."
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* <StatsBar products={products} /> */}

        <div className="flex lg:flex-row flex-col gap-6 mb-8">
          <div className="lg:w-80">
            <FiltersPanel
              priceRange={priceRange}
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600 text-sm">
                Showing {searchResults.length} of {products.length} products
              </span>
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>

            <SearchResults
              products={searchResults}
              query={debouncedQuery}
              totalProducts={products.length}
              isLoading={false}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-16 border-t">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl text-gray-600 text-center">
          © 2024 Product Search. Built with Next.js and modern web technologies.
        </div>
      </footer>
    </div>
  );
}
