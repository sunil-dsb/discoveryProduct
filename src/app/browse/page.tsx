import { Suspense } from "react";
import { BrowseClient } from "./BrowseClient";
import { getProducts, getCategories, getBrands, getTags } from "@/lib/api";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  
  const search = {
    q: sp.q,
    category: sp.category,
    brand: sp.brand,
    tag: sp.tag,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    minRating: sp.minRating ? Number(sp.minRating) : undefined,
    available: sp.available === "true",
    page: sp.page ? Number(sp.page) : 1,
    limit: 50,
  };

  const [{ products, totalCount }, categories, brands, tags] = await Promise.all([
    getProducts(search),
    getCategories(),
    getBrands(),
    getTags()
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <BrowseClient 
        initialSearch={search} 
        products={products} 
        totalCount={totalCount}
        categories={categories} 
        brands={brands} 
        tags={tags} 
      />
      <Footer />
    </div>
  );
}
