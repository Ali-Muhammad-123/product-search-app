# 🔍 Product Search App

A fast and scalable product search interface built with **Next.js**, **Fuse.js**, and **Web Workers**. It supports fuzzy search, filtering, sorting, and pagination — all on the client side using a CSV product dataset.

---

## Demo : https://www.loom.com/share/04734c1c0d434e7885e4490c6b56fc0f

## 1. 📦 Setup and Installation Instructions

### Clone the Repository

```bash
git clone https://github.com/Ali-Muhammad-123/product-search-app.git
cd product-search-app
```

### Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.

### Build for Production

```bash
npm run build
npm start
```

### CSV Setup

Place your `csv.csv` file inside the `public/` folder. It should contain at least the following columns:

---

## 2. 🧠 Overview of Your Search Implementation Approach

- **CSV Parsing** is done via a **Web Worker** using `PapaParse` to avoid blocking the main thread.
- **Search Execution** is also offloaded to a **dedicated search worker**, using `Fuse.js` for fuzzy matching.
- The app applies **filters and sorting** inside the worker before returning results to the UI.
- A **debounced search query** improves responsiveness during typing.
- Pagination is used to limit UI rendering per page and keep things snappy.

---

## 3. ✨ Explanation of Additional Features You've Added

- ✅ **Fuzzy Matching** with `Fuse.js` on product `title`, `description`, and `tags`.
- ⚙️ **Background Search Engine** using Web Workers for off-main-thread performance.
- 🔀 **Filters** include:
  - **Price Slider** (high → low)
  - Manual **min/max price inputs**
- 📈 **Stats Bar** to show total and visible product counts.
- 🧭 **Sorting** options by price and name (ascending/descending).
- 🧩 **Suggestions** panel while typing in the search bar.
- 📱 **Responsive Design** with **Grid/List Toggle**.

---

## 4. ⚙️ Technical Decisions and Trade-offs

| Decision                            | Rationale                                                | Trade-off                                    |
| ----------------------------------- | -------------------------------------------------------- | -------------------------------------------- |
| Web Workers for parsing & search    | Keeps UI responsive with large datasets                  | Requires async setup & message passing logic |
| Fuse.js for fuzzy search            | Offers typo tolerance and improved UX                    | Slightly larger bundle size (~15KB gzipped)  |
| Client-side CSV loading             | Easy to host/deploy without a backend                    | Not suited for massive datasets (>10k items) |
| Reversed slider for price filtering | Matches expectation of filtering down from higher prices | Unconventional UX, needs clear labels        |
| Debounced search input              | Reduces computational load while typing                  | Introduces slight search delay (~500ms)      |

---

## 5. 🎨 Assumptions or Creative Interpretations

- The `csv.csv` file is assumed to be reasonably sized (<10,000 rows) for client-side processing.
- `priceRange` values are extracted from nested fields using JSON parsing.
- Reversed price slider is used to align with common "high-to-low" filter workflows.
- Product tags are parsed from comma-separated strings and matched during fuzzy search.
- No backend is used — all logic (search, parsing, filtering) is performed in-browser.

---

## 🛠 Built With

- [Next.js](https://nextjs.org/)
- [Fuse.js](https://fusejs.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [PapaParse](https://www.papaparse.com/)

---

## 📄 License

MIT License — © 2025
