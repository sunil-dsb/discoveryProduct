# Home Goods — Product Discovery

A focused product discovery page built for 4,000 home goods objects.
Live at: [product-discovery-tau.vercel.app](https://product-discovery-tau.vercel.app)

---

## What was built

Three lightweight views:

- **Discover (/)** — editorial landing page with a hero search bar, quick category shortcuts, a ranked brand directory, and tag-driven collections. Designed to make someone feel oriented before they start typing.
- **Browse (/browse)** — the main search and filter surface, with its own dedicated page. Live search across title, brand, category, tags, and description. Sidebar filters for category, brand, tag, and rating. Paginated grid of results (50 per page).
- **Brands (/brands)** — full brand directory with item counts, linking directly into filtered browse results.

**Search preview:** the search bar on the landing page shows an inline preview of matching items as you type title, brand, and image so users get immediate feedback without navigating away. Selecting a result takes you directly to the browse page with that query pre-filled.

Everything runs server-side. The JSON is fetched once on load, normalized into structured in supabase tables, and held there.

---




---

## Data normalization

The raw JSON is a flat array of 4,000 objects where category, brand, and tags are plain strings repeated on every product. Before building any UI, the data was normalized into separate tables:

| Table | Contents |
|---|---|
| `categories` | Unique category names, each assigned a stable id |
| `brands` | Unique brand names, each assigned a stable id |
| `tags` | Unique tag names, each assigned a stable id |
| `products` | Core product records with `category_id`, `brand_id` references |
| `product_tags` | Junction table linking each product to its tag ids (many-to-many) |

The reason it matters for the UI: filters work by id lookup against these tables rather than string comparison across 4,000 raw objects. Combining a category filter, a brand filter, and a search query is clean and consistent — there is no risk of "Storage" vs "storage" producing different results, and adding a new filter dimension would not require touching the search logic.

The normalization step runs once when the JSON loads. From that point on, all search and filtering operates against the structured tables, not the raw source array.

---

## Search decisions

**What is searched:** every query runs across title, brand name, category name, tags, and description simultaneously. Matching on title only would miss obvious lookups like "Fenwick" (a brand) or "rattan" (a tag that doesn't always appear in the title).

**Fuzzy matching with Fuse.js:** exact substring search on a catalog where products share adjectives and materials produces noisy results and breaks on typos. Fuse.js was chosen as a lightweight, dependency-free fuzzy search library — it runs in-browser with no network call, handles typos gracefully, and is tunable per field.

**Field weights:** not all matches are equal. Title matches are weighted higher than tag or description matches — if someone types "crate" they expect crate products first, not products that mention crates in a description.

**Debounced live results:** results update as the user types with a short debounce (~200ms). There is no submit button. This keeps the interaction feel close to filtering rather than searching, which suits a browse-first catalog.

**Result states:** zero-results returns a visible empty state with the query reflected back to the user, not a blank grid. This was a deliberate choice — a blank page with no explanation is the most common way product search fails in practice.

**Filters are secondary to search:** brand, tag, category, and rating filters live in the Browse page sidebar and work in combination with any active search query. They are not the primary navigation — they refine. The category pills at the top of the browse page are the fastest path to narrowing by type without typing anything. Crucially, all filters operate against the normalized lookup tables described above, so combining multiple filters is reliable and consistent regardless of how the source data was originally cased or formatted.

---

## UI decisions

**No cart, no product detail, no auth.** The brief was explicit about this. Adding those would have consumed time without adding anything to the discovery experience being evaluated.

**Editorial landing page instead of search-only.** A blank search bar on an empty page asks the user to know what they want before they arrive. The landing page shows categories, brands, and tag-collections upfront so someone can orient themselves by browsing before searching. The hero search bar is still the dominant element but is surrounded by enough context that the page is useful without it.

**Card grid with minimal information.** Each card shows image, title, brand, category, price, rating, and a couple of tags. Nothing more. The temptation to show more fields was resisted — adding reviews count, stock status, and description to every card would make the grid feel busy without helping the browsing decision.

**Single accent color, restrained type scale.** The UI uses one accent color throughout. No gradients, no decorative elements competing with product images. The goal was for the products to be the visual content, not the interface.

---

## What would be done next

**Semantic / vector search.** The catalog's consistent naming pattern (`adjective + material + object`) makes it ideal for embedding-based search. A user who types "earthy storage with texture" should surface rattan and terracotta pieces — that query produces zero results with keyword search today. This is the highest-value next improvement.

**Product detail page.** Currently clicking a card leads to a URL but no detail view. With another hour, a simple detail page (large image, full description, related products by tag/brand) would complete the experience.

**URL-persisted search state.** Search queries and active filters should write to the URL so results are shareable and the back button works as expected. This is the most obvious missing UX piece.

**Better image handling.** The dataset uses `picsum.photos` placeholder images that don't reflect the actual product. In a real catalog, images are the primary browsing signal — lazy loading, aspect-ratio locking, and graceful fallbacks would all matter.

---

## The one tradeoff to watch

**Client-side Fuse.js does not scale beyond this catalog size.** At 4,000 items, running fuzzy search in the browser is fast. At 40,000 items, initial load time and search latency become noticeable problems. The correct fix is a dedicated search service (Algolia, Typesense, or a pgvector-backed endpoint) where the index lives server-side and the browser only sends a query string and receives pre-ranked results. The current architecture makes sense for this task but should not be carried forward into a production catalog without revisiting this constraint.

---

## Stack

- Next.js (App Router) + Tailwind CSS
- Fuse.js for client-side fuzzy search
- Data fetched once at runtime from the upstream JSON, held in memory
- Deployed on Vercel