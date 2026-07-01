"use client";

import { Heart, Share2 } from "lucide-react";
import { useState } from "react";

export function ProductActions({ price }: { price: number }) {
  const [fav, setFav] = useState(false);

  return (
    <div className="mt-10 p-6 rounded-3xl border border-line bg-card">
      <div className="flex items-baseline justify-between">
        <p className="font-display text-4xl">${price.toLocaleString()}</p>
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
  );
}
