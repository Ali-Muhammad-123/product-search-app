importScripts("https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js");

onmessage = function (e) {
  const csvText = e.data;

  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const data = results.data.map((row) => {
        return {
          id: parseInt(row.ID) || 0,
          title: row.TITLE || "",
          vendor: row.VENDOR || "",
          status: row.STATUS || "",
          description: row.DESCRIPTION|| "",
          product_type: row.PRODUCT_TYPE|| "default",
          price: parseFloat(JSON.parse(row.PRICE_RANGE || "{}").max_variant_price?.amount) || 0,
          tags: (row.TAGS || "").split(",").map((t) => t.trim()),
          url: `/products/${row.HANDLE}`,
        };
      });
      postMessage(data);
    },
  });
};
