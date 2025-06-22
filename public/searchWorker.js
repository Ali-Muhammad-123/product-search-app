// Load Fuse.js in the worker context
importScripts("https://cdn.jsdelivr.net/npm/fuse.js@6.6.2");

let products = [];
let fuse = null;

onmessage = function (e) {
  const { type, data } = e.data;

  if (type === "init") {
    products = data;

    // Initialize Fuse instance
    fuse = new Fuse(products, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "description", weight: 0.3 },
        { name: "tags", weight: 0.3 },
        { name: "vendor", weight: 0.3 },
        { name: "product_type", weight: 0.3 }
      ],
      threshold: 0.4, // Controls fuzziness (lower = stricter)
      includeScore: false,
    });
  }

  if (type === "search") {
    const { query, filters, sortBy } = data;
    const lowerQuery = query.trim().toLowerCase();

    let results = [];

    // Fuzzy search if query exists
    if (lowerQuery && fuse) {
      results = fuse.search(lowerQuery).map((r) => r.item);
    } else {
      results = [...products];
    }

    // Filter: price
    if (filters?.priceRange) {
      const [min, max] = filters.priceRange;
      results = results.filter(
        (p) => p.price >= min && p.price <= max
      );
    }
    // Sorting
    if (sortBy && sortBy !== "relevance") {
      results.sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "name-asc":
            return a.title.localeCompare(b.title);
          case "name-desc":
            return b.title.localeCompare(a.title);
        }
      });
    }

    postMessage({ type: "results", results });
  }
};
