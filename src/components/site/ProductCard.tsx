"use client";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useState } from "react";

export function ProductCard({ product, index = 0, showSpecialTags }: { product: any; index?: number; showSpecialTags?: boolean }) {
  const [fav, setFav] = useState(false);
  const brand = product.brand;
  const category = product.category;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block animate-float-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-secondary mb-5">
        <img
          src={product.image}
          alt={product.title}
          width={800}
          height={1000}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04]"
        />
        {product.badge && (
          <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-background/85 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider">
            {product.badge}
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            setFav((v) => !v);
          }}
          className={`absolute top-4 right-4 size-10 grid place-items-center rounded-full backdrop-blur-md border transition-all ${
            fav
              ? "bg-primary text-primary-foreground border-primary shadow-glow"
              : "bg-background/85 border-line text-foreground hover:scale-110"
          }`}
          aria-label="Save"
        >
          <Heart className={`size-4 ${fav ? "fill-current" : ""}`} />
        </button>

      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary truncate">
            {category?.name} · {brand?.name}
          </p>
          <h3 className="font-display text-xl mt-1 leading-tight truncate group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {product.tags?.slice(0, 2).map((t: any) => (
              <span key={t.id} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                #{t.name}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-mono text-sm font-medium">${(product.price ?? 0).toLocaleString()}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {product.rating} <span className="text-muted-foreground/60">({product.reviews})</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
