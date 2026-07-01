"use client";
import { ArrowLeft, Heart, Share2, Star, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";

export function ProductClient({ product, relatedCategory, relatedBrand, relatedTags }: any) {
  const [fav, setFav] = useState(false);
  const brand = product.brand;
  const category = product.category;

  return (
    <main className="mx-auto max-w-7xl px-6 pt-8 pb-20">
      <Link href="/browse" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="size-3.5" /> Back to browse
      </Link>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16">
        {/* Image */}
        <div className="relative">
          <div className="sticky top-24">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-secondary">
              <img src={product.image} alt={product.title} className="absolute inset-0 size-full object-cover" />
              {product.badge && (
                <span className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-background/85 backdrop-blur text-[10px] font-semibold uppercase tracking-wider">
                  {product.badge}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="lg:pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            {category?.name} · {brand?.name}
          </p>
          <h1 className="font-display text-5xl md:text-6xl mt-3 leading-[0.95] text-balance">{product.title}</h1>

          <div className="mt-5 flex items-center gap-4 text-sm">
            <div className="inline-flex items-center gap-1.5">
              <Star className="size-3.5 fill-current" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews.toLocaleString()} reviews)</span>
            </div>

          </div>

          <p className="mt-8 text-base text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="mt-8 flex flex-wrap gap-2">
            {product.tags?.map((t: any) => (
              <Link
                key={t.id}
                href={`/browse?tag=${t.id}`}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-ink hover:text-background transition"
              >
                #{t.name}
              </Link>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-3xl border border-line bg-card">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-4xl">${product.price.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Free shipping over $200</p>
            </div>
            <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2">
              <button className="h-12 rounded-full bg-ink text-background font-medium text-sm hover:opacity-90 transition">
                Add to collection
              </button>
              <button
                onClick={() => setFav((v) => !v)}
                className={`size-12 grid place-items-center rounded-full border transition ${
                  fav ? "bg-primary text-primary-foreground border-primary" : "border-line hover:bg-secondary"
                }`}
                aria-label="Save"
              >
                <Heart className={`size-4 ${fav ? "fill-current" : ""}`} />
              </button>
              <button className="size-12 grid place-items-center rounded-full border border-line hover:bg-secondary" aria-label="Share">
                <Share2 className="size-4" />
              </button>
            </div>
          </div>

          {/* Brand mini-card */}
          <Link
            href={`/browse?brand=${brand?.id}`}
            className="mt-6 p-5 rounded-3xl border border-line bg-card flex items-center gap-4 hover:shadow-soft transition group"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Made by</p>
              <p className="font-display text-xl">{brand?.name}</p>
              <p className="text-xs text-muted-foreground">{brand?.origin} · {brand?.productCount} objects</p>
            </div>
            <span className="text-sm text-primary group-hover:underline">Browse →</span>
          </Link>
        </div>
      </div>

      {/* Related */}
      <div className="mt-32 space-y-20">
        <RelatedRow title="More from this category" items={relatedCategory} />
        <RelatedRow title={`More from ${brand?.name}`} items={relatedBrand} />
        <RelatedRow title="Sharing similar tags" items={relatedTags} />
      </div>
    </main>
  );
}

function RelatedRow({ title, items }: { title: string; items: any[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section>
      <h3 className="font-display text-3xl mb-8">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-12">
        {items.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
