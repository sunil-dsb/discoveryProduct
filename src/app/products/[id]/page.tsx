import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { getProductBySlug, getProducts } from "@/lib/api";
import { ProductClient } from "./ProductClient";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.id);
  
  if (!product) {
    notFound();
  }

  // Fetch related products
  // In a real app we might do more specific queries, but for now we fetch a batch or use getProducts
  const { products: allProducts } = await getProducts();
  
  const relatedCategory = allProducts.filter((p: any) => p.category_id === product.category_id && p.id !== product.id).slice(0, 3);
  const relatedBrand = allProducts.filter((p: any) => p.brand_id === product.brand_id && p.id !== product.id).slice(0, 3);
  const relatedTags = allProducts
    .filter((p: any) => p.id !== product.id && p.tagIds.some((t: any) => product.tagIds.includes(t)))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <ProductClient 
        product={product} 
        relatedCategory={relatedCategory} 
        relatedBrand={relatedBrand} 
        relatedTags={relatedTags} 
      />
      <Footer />
    </div>
  );
}
