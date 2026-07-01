"use client";
import { Search, ArrowRight, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";



const popularSearches = [
  "Brushed Rattan Crate",
  "Minimal Linen Planter Box",
  "Sculptural Terracotta Tumbler",
  "Minimal Rattan Cutting Board",
];
const recentSearches = [
  "Wide Leather Tea Towel",
  "Stackable Velvet Cutting Board",
];

export function SearchBar({ size = "lg" }: { size?: "lg" | "md" }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [phIdx, setPhIdx] = useState(0);
  const [placeholders, setPlaceholders] = useState<string[]>(["Search..."]);

  useEffect(() => {
    supabase.from("products").select("title").limit(5).then(res => {
      if (res.data && res.data.length > 0) {
        setPlaceholders(res.data.map(p => `Search ${p.title.toLowerCase()}...`));
      }
    });
  }, []);
  const [suggestions, setSuggestions] = useState<any>({ products: [], categories: [], brands: [], tags: [] });
  const wrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (value) return;
    const t = setInterval(() => setPhIdx((i) => (i + 1) % placeholders.length), 2800);
    return () => clearInterval(t);
  }, [value, placeholders.length]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value.trim()) {
        setSuggestions({ products: [], categories: [], brands: [], tags: [] });
        return;
      }
      
      const q = value.trim();
      const [pRes, cRes, bRes, tRes] = await Promise.all([
        supabase.from("products").select("*, brand:brands(*), category:categories(*)").ilike("title", `%${q}%`).limit(3),
        supabase.from("categories").select("*").ilike("name", `%${q}%`).limit(3),
        supabase.from("brands").select("*").ilike("name", `%${q}%`).limit(3),
        supabase.from("tags").select("*").ilike("name", `%${q}%`).limit(3),
      ]);

      setSuggestions({
        products: pRes.data || [],
        categories: cRes.data || [],
        brands: bRes.data || [],
        tags: tRes.data || [],
      });
    };
    
    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [value]);

  const showSuggestions = focused && value.trim().length > 0;
  const showRecent = focused && value.trim().length === 0;

  const submit = (q: string) => {
    router.push("/browse?q=" + encodeURIComponent(q));
    setFocused(false);
  };

  const heightCls = size === "lg" ? "h-16 text-sm pl-14 pr-36" : "h-12 text-xs pl-11 pr-28";
  const iconCls = size === "lg" ? "left-5 size-5" : "left-4 size-4";

  return (
    <div ref={wrapRef} className="relative w-full">
      <div className="relative group">
        <Search className={`absolute top-1/2 -translate-y-1/2 ${iconCls} text-muted-foreground pointer-events-none`} />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit(value);
            if (e.key === "Escape") setFocused(false);
          }}
          placeholder={placeholders[phIdx]}
          className={`w-full ${heightCls} rounded-full bg-card border border-line shadow-soft focus:outline-none focus:border-primary/40 focus:shadow-glow transition-all placeholder:text-muted-foreground/70`}
        />
        {value && (
          <button
            onClick={() => setValue("")}
            className="absolute right-20 top-1/2 -translate-y-1/2 size-7 grid place-items-center rounded-full hover:bg-secondary text-muted-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
        <button
          onClick={() => submit(value)}
          className={`absolute top-1/2 -translate-y-1/2 right-2 ${size === "lg" ? "h-12 px-5" : "h-9 px-3.5"} inline-flex items-center gap-1.5 rounded-full bg-ink text-background font-medium text-sm hover:opacity-90 active:scale-[0.98] transition`}
        >
          Search <ArrowRight className="size-4" />
        </button>
      </div>

      {/* Suggestions popover */}
      {(showSuggestions || showRecent) && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-card border border-line rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 z-10 animate-float-in">
          {showRecent && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Recent searches</p>
                <ul className="space-y-1">
                  {recentSearches.map((s) => (
                    <li key={s}>
                      <button onClick={() => submit(s)} className="w-full text-left text-sm py-1.5 px-2 -mx-2 rounded-md hover:bg-secondary flex items-center gap-2">
                        <Search className="size-3.5 text-muted-foreground" /> {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Sparkles className="size-3" /> Popular this week
                </p>
                <ul className="space-y-1">
                  {popularSearches.map((s) => (
                    <li key={s}>
                      <button onClick={() => submit(s)} className="w-full text-left text-sm py-1.5 px-2 -mx-2 rounded-md hover:bg-secondary">
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {showSuggestions && (
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
              {suggestions.products.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Products</p>
                  <ul className="space-y-2">
                    {suggestions.products.map((p: any) => (
                      <li key={p.id}>
                        <Link
                          href={`/browse?q=${encodeURIComponent(p.title)}`}
                          onClick={() => setFocused(false)}
                          className="flex items-center gap-3 py-1.5 px-2 -mx-2 rounded-lg hover:bg-secondary"
                        >
                          <img src={p.image} alt="" className="size-10 rounded-md object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{highlight(p.title, value)}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {p.brand?.name} · {p.category?.name}
                            </p>
                          </div>
                          <span className="text-sm font-mono">${p.price}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-6">
                {suggestions.categories.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">Categories</p>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.categories.map((c: any) => (
                        <Link
                          key={c.id}
                          href={`/browse?category=${c.slug}`}
                          onClick={() => setFocused(false)}
                          className="text-xs px-2.5 py-1 rounded-full bg-secondary hover:bg-ink hover:text-background transition"
                        >
                          {highlight(c.name, value)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {suggestions.brands.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">Brands</p>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.brands.map((b: any) => (
                        <Link
                          key={b.id}
                          href={`/browse?brand=${b.id}`}
                          onClick={() => setFocused(false)}
                          className="text-xs px-2.5 py-1 rounded-full bg-secondary hover:bg-ink hover:text-background transition"
                        >
                          {highlight(b.name, value)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {suggestions.tags.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.tags.map((t: any) => (
                        <Link
                          key={t.id}
                          href={`/browse?tag=${t.id}`}
                          onClick={() => setFocused(false)}
                          className="text-xs px-2.5 py-1 rounded-full bg-secondary hover:bg-ink hover:text-background transition"
                        >
                          #{highlight(t.name, value)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {suggestions.products.length === 0 &&
                suggestions.categories.length === 0 &&
                suggestions.brands.length === 0 &&
                suggestions.tags.length === 0 && (
                  <div className="col-span-2 py-6 text-center text-sm text-muted-foreground">
                    No matches for "{value}". Try a category or brand.
                  </div>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function highlight(text: string, q: string) {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/15 text-primary rounded px-0.5">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}
