import Link from "next/link";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
export function Collection({ id, title, description, items }: { id: string; title: string; description: string; items: any[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="py-6">
      <div className="flex items-end justify-between mb-8 gap-6">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-2 opacity-50">Collection</p>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-md">{description}</p>
        </div>
        <Link href={`/browse?tag=${id}`} className="hidden sm:inline-flex items-center gap-1 text-sm font-medium hover:text-primary">
          View collection <ArrowUpRight className="size-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {items.slice(0, 4).map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} showSpecialTags={title === "Warm Minimalism"} />
        ))}
      </div>
    </section>
  );
}
