"use client";
import { useState } from "react";
import { X, SlidersHorizontal, Star, StarHalf } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/site/SearchBar";
import { ProductCard } from "@/components/site/ProductCard";
import { CategoryChips } from "@/components/site/CategoryChips";

export function BrowseClient({ initialSearch, products, totalCount, categories, brands, tags }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFilters, setMobileFilters] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  // We rely on initialSearch from server instead of reading from searchParams continuously to avoid mismatch
  // However, updating searchParams will trigger a re-render from the server, which passes new props down.
  const search = initialSearch;

  const setSearch = (patch: any) => {
    const p = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined) p.delete(k);
      else p.set(k, String(v));
    }
    // Reset page to 1 when filters change (unless page itself is being changed)
    if (!('page' in patch)) {
      p.delete("page");
    }
    router.push("?" + p.toString());
    setMobileFilters(false);
  };
  
  const clearAll = () => {
    router.push("?");
    setMobileFilters(false);
  };

  const activeChips: { key: string; label: string }[] = [];
  if (search.q) activeChips.push({ key: "q", label: `"${search.q}"` });
  if (search.category) {
    const c = categories.find((c: any) => String(c.id) === String(search.category));
    if (c) activeChips.push({ key: "category", label: c.name });
  }
  if (search.brand) {
    const b = brands.find((b: any) => String(b.id) === String(search.brand));
    if (b) activeChips.push({ key: "brand", label: b.name });
  }
  if (search.tag) {
    const t = tags.find((t: any) => String(t.id) === String(search.tag));
    if (t) activeChips.push({ key: "tag", label: `#${t.name}` });
  }
  if (search.minRating) activeChips.push({ key: "minRating", label: `${search.minRating}+ stars` });


  return (
    <>
      <div className="sticky top-16 z-30 backdrop-blur-xl bg-background/85 border-b border-line">
        <div className="mx-auto max-w-7xl px-6 py-3 flex flex-col md:flex-row md:items-center gap-3 md:gap-8">
          <div className="w-full md:w-[420px] shrink-0">
            <SearchBar size="md" />
          </div>
          <div className="w-full flex-1 min-w-0">
            <CategoryChips categories={categories} activeSlug={search.category} />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid lg:grid-cols-[260px_1fr] gap-10">
          <aside className={`${mobileFilters ? "fixed inset-0 z-50 bg-background overflow-y-auto p-6" : "hidden"} lg:block lg:static lg:p-0 lg:sticky lg:top-44 lg:self-start lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto no-scrollbar`}>
            <div>
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="font-display text-2xl">Filters</h3>
                <button onClick={() => setMobileFilters(false)} className="size-9 grid place-items-center rounded-full border border-line">
                  <X className="size-4" />
                </button>
              </div>

              <FilterGroup title="Brand">
                <div className="space-y-2.5">
                  {(showAllBrands ? brands : brands.slice(0, 6)).map((b: any) => {
                    const active = String(search.brand) === String(b.id);
                    return (
                      <label
                        key={b.id}
                        className="flex items-center gap-2.5 text-sm cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => setSearch({ brand: active ? undefined : b.id })}
                          className="size-4 rounded border-line accent-ink cursor-pointer"
                        />
                        <span className={`flex-1 transition-colors ${active ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
                          {b.name}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">{b.productCount}</span>
                      </label>
                    );
                  })}
                  {brands.length > 6 && (
                    <button
                      onClick={() => setShowAllBrands(!showAllBrands)}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground pt-1 text-left w-full"
                    >
                      {showAllBrands ? "— View less" : `+ View ${brands.length - 6} more`}
                    </button>
                  )}
                </div>
              </FilterGroup>

              <FilterGroup title="Tags">
                <div className="flex flex-wrap gap-1.5">
                  {(showAllTags ? tags : tags.slice(0, 8)).map((t: any) => {
                    const active = String(search.tag) === String(t.id);
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSearch({ tag: active ? undefined : t.id })}
                        className={`text-xs px-2.5 py-1 rounded-full border transition ${
                          active ? "bg-ink text-background border-ink" : "border-line bg-card hover:border-primary/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        #{t.name}
                      </button>
                    );
                  })}
                </div>
                {tags.length > 8 && (
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground mt-3 text-left w-full"
                  >
                    {showAllTags ? "— View less" : `+ View ${tags.length - 8} more tags`}
                  </button>
                )}
              </FilterGroup>

              <FilterGroup title="Rating">
                <div className="space-y-1.5">
                  {[4.5, 4.0, 3.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setSearch({ minRating: search.minRating === r ? undefined : r })}
                      className={`w-full text-left px-2 py-1.5 -mx-2 rounded-lg text-sm transition flex items-center gap-2 ${
                        search.minRating === r ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                      }`}
                    >
                      <Star className="size-4 fill-amber-400 text-amber-400" />
                      <span>{r}+ stars</span>
                    </button>
                  ))}
                </div>
              </FilterGroup>



              <button
                onClick={clearAll}
                className="w-full mt-4 h-10 rounded-full border border-line text-sm hover:bg-secondary transition"
              >
                Reset filters
              </button>
            </div>
          </aside>

          <section>
            <div className="flex items-end justify-between mb-6 gap-4">
              <div>
                <h1 className="font-display text-4xl">
                  {search.q ? <>Results for <em className="italic text-primary">"{search.q}"</em></> : "Browse all"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Showing <span className="font-mono text-foreground">{totalCount > 0 ? (search.page - 1) * 50 + 1 : 0}-{Math.min(search.page * 50, totalCount)}</span> of <span className="font-mono text-foreground">{totalCount}</span> matching objects
                </p>
              </div>
              <button
                onClick={() => setMobileFilters(true)}
                className="lg:hidden inline-flex items-center gap-2 h-10 px-4 rounded-full border border-line text-sm"
              >
                <SlidersHorizontal className="size-3.5" /> Filters
              </button>
            </div>

            {activeChips.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {activeChips.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setSearch({ [c.key]: undefined })}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink text-background text-xs"
                  >
                    {c.label} <X className="size-3" />
                  </button>
                ))}
                <button onClick={clearAll} className="text-xs px-3 py-1 underline text-muted-foreground hover:text-foreground">
                  Clear all
                </button>
              </div>
            )}

            {products.length === 0 ? (
              <div className="text-center py-32 border border-dashed border-line rounded-3xl">
                <p className="font-display text-3xl">Nothing matches — yet.</p>
                <p className="text-sm text-muted-foreground mt-2">Try removing a filter or searching for something looser.</p>
                <button onClick={clearAll} className="mt-6 h-10 px-5 rounded-full bg-ink text-background text-sm">Reset</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
                  {products.map((p: any, i: number) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
                {totalCount > 50 && (
                  <div className="mt-16 flex items-center justify-center gap-4">
                    <button
                      disabled={search.page === 1}
                      onClick={() => setSearch({ page: search.page - 1 })}
                      className="h-10 px-4 rounded-full border border-line bg-card disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary text-sm transition"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-muted-foreground font-medium">
                      Page {search.page} of {Math.ceil(totalCount / 50)}
                    </span>
                    <button
                      disabled={search.page >= Math.ceil(totalCount / 50)}
                      onClick={() => setSearch({ page: search.page + 1 })}
                      className="h-10 px-4 rounded-full border border-line bg-card disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary text-sm transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-5 border-b border-line first:border-t first:border-line">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">{title}</p>
      {children}
    </div>
  );
}
