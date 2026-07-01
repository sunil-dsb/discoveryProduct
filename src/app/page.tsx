import { Suspense } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SearchBar } from "@/components/site/SearchBar";
import { CategoryChips } from "@/components/site/CategoryChips";
import { BrandRail } from "@/components/site/BrandRail";
import { Collection } from "@/components/site/Collection";
import { getFeaturedCollections, getCategories, getBrands, getProducts } from "@/lib/api";

export default async function Page() {
  const [categories, brands, collections, { products, totalCount }] = await Promise.all([
    getCategories(),
    getBrands(),
    getFeaturedCollections(),
    getProducts()
  ]);

  const popularSearches = ["Brushed Rattan Crate", "Minimal Linen Planter Box", "Sculptural Terracotta Tumbler", "Minimal Rattan Cutting Board"];
  const validProducts = products.filter((p: any) => p.image);
  // const heroProducts = products.filter(p => p.image).slice(5, 8);
  const heroProducts = ["https://i.pinimg.com/736x/f5/8d/79/f58d797fe4fac2a58dd54b315d1f9086.jpg", "https://i.pinimg.com/1200x/08/da/7e/08da7e11fae45012ad93053954bb5964.jpg", "https://jufaarkitekt.com/images/a15.webp"]

  return (
    <div className="min-h-screen bg-background">
      <Nav />

      <main>
        {/* HERO */}
        <section className="relative z-20">
          {/* soft warm wash */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-secondary)_0%,transparent_70%)]" />
          <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 sm:pt-28 sm:pb-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

              {/* Left Column: Typography & Search */}
              <div className="flex flex-col justify-center max-w-xl animate-float-in" style={{ animationDelay: "80ms" }}>

                <h1 className="font-display text-6xl md:text-7xl lg:text-[4.5rem] leading-[1.0] tracking-tight">
                  Find the <em className="italic">one</em> thing<br />
                  that finishes<br />
                  the room.
                </h1>

                <p className="mt-8 text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed animate-float-in" style={{ animationDelay: "160ms" }}>
                  A discovery surface for considered objects search by feeling, by material, by maker. No carts, no clutter.
                </p>

                <div className="relative z-50 mt-10 max-w-md animate-float-in" style={{ animationDelay: "240ms" }}>
                  <Suspense fallback={<div className="h-16 w-full rounded-full bg-card border border-line shadow-soft" />}>
                    <SearchBar />
                  </Suspense>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2 animate-float-in" style={{ animationDelay: "320ms" }}>
                  {popularSearches.map((s) => (
                    <Link
                      key={s}
                      href={`/browse?q=${s}`}
                      className="text-[11px] px-3 py-1.5 rounded-full bg-card border border-line hover:border-primary/40 hover:text-primary transition"
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right Column: Image Composition */}
              <div className="relative hidden lg:block h-[600px] w-full animate-float-in" style={{ animationDelay: "200ms" }}>
                {/* Large image (Background) */}
                {heroProducts[0] && (
                  <div className="absolute top-0 right-0 w-[70%] aspect-square">
                    <div className="size-full rounded-[2rem] overflow-hidden bg-secondary shadow-sm">
                      <img src={heroProducts[0]} alt="" className="size-full object-cover" />
                    </div>
                    <div className="absolute top-6 left-6 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm text-[12px] font-bold tracking-wider z-20">
                      $129
                    </div>
                    <div className="absolute bottom-6 right-6 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm text-[10px] font-medium flex items-center gap-2 border border-line z-20">
                      <span className="size-1.5 rounded-full bg-[#0066FF]" /> Now browsing · {totalCount} objects
                    </div>
                  </div>
                )}

                {/* Medium image (Overlapping left) */}
                {heroProducts[1] && (
                  <div className="absolute top-[30%] left-0 w-[50%] aspect-square z-10">
                    <div className="size-full rounded-[2rem] overflow-hidden bg-[#FFDEB3] border-[6px] border-background">
                      <img src={heroProducts[1]} alt="" className="size-full object-cover" />
                    </div>
                    <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm text-[10px] font-bold tracking-wider z-20">
                      $87
                    </div>
                  </div>
                )}

                {/* Small image (Overlapping bottom right) */}
                {heroProducts[2] && (
                  <div className="absolute bottom-0 right-[10%] w-[35%] aspect-[4/5] z-10">
                    <div className="size-full rounded-[1.5rem] overflow-hidden bg-secondary border-[6px] border-background">
                      <img src={heroProducts[2]} alt="" className="size-full object-cover" />
                    </div>
                    <div className="absolute bottom-4 left-4 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm text-[10px] font-bold tracking-wider z-20">
                      $45
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* QUICK CATEGORIES */}
        <section className="mx-auto max-w-7xl px-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Quick discovery</p>
            <Link href="/browse" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              All categories <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <CategoryChips categories={categories} />
        </section>

        {/* BRANDS */}
        <section className="mx-auto max-w-7xl px-6 pt-20">
          <BrandRail brands={brands} products={products} />
        </section>

        {/* FEATURED COLLECTIONS */}
        <section className="mx-auto max-w-7xl px-6 pt-24 space-y-24">
          {collections.slice(0, 3).map((c, i) => (
            <Collection key={c.id} id={c.id} title={c.title} description={c.description} items={validProducts.filter((p: any) => p.tagIds?.includes(c.id))} />
          ))}
        </section>

        {/* Editorial closing band */}
        <section className="mx-auto max-w-7xl px-6 mt-32">
          <div className="relative overflow-hidden rounded-[2rem] bg-ink text-background p-10 sm:p-16">
            
            <div className="absolute -right-15 -bottom-15 w-1/2 hidden md:block z-0">
              <img src="https://i.ibb.co/F2y8y8S/Chat-GPT-Image-Jul-1-2026-12-16-47-PM.png" alt="Room" className="size-full object-cover opacity-90 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/20 to-transparent" />
            </div>

            <div className="relative max-w-2xl z-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-background/60 mb-4">Membership</p>
              <h2 className="font-display text-4xl sm:text-5xl leading-tight">
                Discovery is a practice.<br />
                <em className="italic text-accent">We've made you a room for it.</em>
              </h2>
              <p className="mt-5 text-background/70 max-w-md">
                Save objects to collections, follow ateliers, and receive a quiet weekly note from our editors.
              </p>
              <div className="mt-8 inline-flex items-center gap-3">
                <button className="flex gap-2  items-center justify-between h-11 px-5 rounded-full bg-background text-foreground text-sm font-medium hover:opacity-90 transition">
                  Join Home Good <ArrowUpRight className="size-3.5" />
                </button>
                <a href="#" className="text-sm text-background/70 hover:text-background inline-flex items-center gap-1">
                  How we curate <ArrowRight className="size-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
