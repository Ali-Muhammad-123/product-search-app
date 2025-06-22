"use client";

import { useState } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { SearchFilters } from "@/types/product";

interface FiltersPanelProps {
  priceRange: [number, number]; // [min, max]
  filters: Partial<SearchFilters>;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
}

export function FiltersPanel({
  priceRange,
  filters,
  onFiltersChange,
  onClearFilters,
}: FiltersPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentRange = filters.priceRange || priceRange;
  const [minValue, maxValue] = currentRange;

  const handleSliderChange = ([min, max]: number[]) => {
    onFiltersChange({ ...filters, priceRange: [min, max] });
  };

  const handleInputChange = (value: string, type: "min" | "max") => {
    const num = Number(value);
    if (isNaN(num)) return;

    let [min, max] = currentRange;

    if (type === "min") min = Math.min(num, max); // clamp min
    if (type === "max") max = Math.max(num, min); // clamp max

    // Enforce global limits
    min = Math.max(priceRange[0], Math.min(min, priceRange[1]));
    max = Math.max(priceRange[0], Math.min(max, priceRange[1]));

    onFiltersChange({ ...filters, priceRange: [min, max] });
  };

  const hasActiveFilters =
    (filters.category && filters.category !== "all") ||
    (filters.priceRange &&
      (filters.priceRange[0] !== priceRange[0] ||
        filters.priceRange[1] !== priceRange[1])) ||
    filters.rating ||
    filters.inStock;

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardTitle className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-blue-100 px-2 py-1 rounded-full text-blue-800 text-xs">
                    Active
                  </span>
                )}
              </div>
              {isOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Price Filter */}
            <div className="space-y-3">
              <Label className="font-medium text-sm">
                Price Range: ${minValue} - ${maxValue}
              </Label>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={minValue}
                  min={priceRange[0]}
                  max={priceRange[1]}
                  onChange={(e) => handleInputChange(e.target.value, "min")}
                  className="w-24"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="number"
                  value={maxValue}
                  min={priceRange[0]}
                  max={priceRange[1]}
                  onChange={(e) => handleInputChange(e.target.value, "max")}
                  className="w-24"
                />
              </div>

              <Slider
                value={[minValue, maxValue]}
                onValueChange={handleSliderChange}
                min={priceRange[0]}
                max={priceRange[1]}
                step={10}
                className="w-full"
              />
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="w-full"
              >
                Clear All Filters
              </Button>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
