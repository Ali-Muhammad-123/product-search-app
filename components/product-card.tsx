"use client";

import { Star, ShoppingCart, Package } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
}

export function ProductCard({ product, viewMode }: ProductCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : i < rating
            ? "text-yellow-400 fill-current opacity-50"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (viewMode === "list") {
    return (
      <Card className="flex sm:flex-row flex-col gap-4 hover:shadow-md p-4 transition-all">
        <div className="relative flex-shrink-0 bg-gray-100 rounded-md w-full sm:w-48 h-48 overflow-hidden">
          <img
            src={"/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col flex-1 justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">
                {product.title}
              </h3>
              <Badge variant="outline">{product.product_type}</Badge>
            </div>

            <p className="mb-2 text-gray-600 text-sm line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center gap-2 mb-1 text-sm">
              <span className="text-gray-500">by</span>
              <span className="font-medium text-blue-600">
                {product.vendor}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <span className="font-bold text-green-600 text-xl">
              ${product.price}
            </span>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ShoppingCart className="mr-2 w-4 h-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // fallback to default grid view (existing UI)
  return (
    <Card className="group flex flex-col justify-between hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
      <CardContent className="p-4">
        <div className="relative bg-gray-100 mb-4 rounded-lg aspect-square overflow-hidden">
          <img
            src={"/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="w-full font-semibold group-hover:text-blue-600 text-lg line-clamp-2 transition-colors">
              {product.title}
            </h3>
            {product.product_type !== "default" ? (
              <Badge variant="outline" className="text-center">
                {product.product_type}
              </Badge>
            ) : (
              <></>
            )}
          </div>

          <p className="mb-2 text-gray-600 text-sm line-clamp-2">
            {product.description}
          </p>

          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-gray-500 text-sm">by</span>
              <span className="font-medium text-blue-600 text-sm">
                {product.vendor}
              </span>
            </div>
            <span className="font-bold text-green-600 text-2xl">
              ${product.price}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col justify-between items-center p-4 pt-0">
        <Button className="bg-blue-600 hover:bg-blue-700 w-full text-white">
          <ShoppingCart className="mr-2 w-4 h-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
