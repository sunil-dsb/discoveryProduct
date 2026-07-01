import { supabase } from "./supabase";

export async function getCategories() {
  const { data } = await supabase.from("categories").select("*").order("name");
  return data || [];
}

export async function getBrands() {
  const { data } = await supabase.from("brands").select("*, products(count)").order("name");
  return (data || []).map((b: any) => ({
    ...b,
    productCount: b.products?.[0]?.count || 0,
  }));
}

export async function getTags() {
  const { data } = await supabase.from("tags").select("*").order("name");
  return data || [];
}

export async function getProducts(search?: {
  q?: string;
  category?: string;
  brand?: string;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  available?: boolean;
  page?: number;
  limit?: number;
}) {
  let query = supabase.from("products").select(`
    *,
    category:categories(*),
    brand:brands(*),
    product_tags!inner(tag_id, tags(*))
  `, { count: "exact" });

  if (search?.category) {
    query = query.eq("category_id", search.category);
  }
  if (search?.brand) {
    query = query.eq("brand_id", search.brand);
  }
  if (search?.tag) {
    query = query.eq("product_tags.tag_id", search.tag);
  }
  if (search?.minPrice !== undefined) {
    query = query.gte("price", search.minPrice);
  }
  if (search?.maxPrice !== undefined) {
    query = query.lte("price", search.maxPrice);
  }
  if (search?.minRating !== undefined) {
    query = query.gte("rating", search.minRating);
  }
  if (search?.available) {
    query = query.eq("in_stock", true);
  }
  if (search?.q) {
    query = query.ilike("title", `%${search.q}%`);
  }

  if (search?.page && search?.limit) {
    const from = (search.page - 1) * search.limit;
    const to = from + search.limit - 1;
    query = query.range(from, to);
  }

  const { data, count, error } = await query;
  if (error) {
    console.error("Supabase error:", error);
    return { products: [], totalCount: 0 };
  }

  const products = (data || []).map((p: any) => ({
    ...p,
    available: p.in_stock,
    tagIds: p.product_tags.map((pt: any) => pt.tag_id),
    tags: p.product_tags.map((pt: any) => pt.tags),
  }));

  return { products, totalCount: count || 0 };
}

export async function getProductBySlug(slug: string) {
  // Since we don't have a slug column in products, maybe it's source_id or id? 
  // Wait, old code used slug. We can just use id or ilike on title. Let's assume id for now.
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      brand:brands(*),
      product_tags(tags(*))
    `)
    .eq("id", slug)
    .single();
    
  if (error) return null;
  return {
    ...data,
    available: data.in_stock,
    tagIds: data.product_tags.map((pt: any) => pt.tags.id),
    tags: data.product_tags.map((pt: any) => pt.tags),
  };
}

export async function getFeaturedCollections() {
  const { data: tags, error } = await supabase.from("tags").select("*");
  
  if (error || !tags) {
    console.error("Error fetching tags for featured collections:", error);
    return [];
  }

  const sculpture = tags.find((t: any) => t.name.toLowerCase() === "sculpture");
  const others = tags.filter((t: any) => t.name.toLowerCase() !== "sculpture").slice(0, 2);

  const selectedTags = [];
  if (sculpture) selectedTags.push(sculpture);
  selectedTags.push(...others);

  return selectedTags.map((tag: any) => ({
    id: tag.id,
    title: tag.name,
    description: tag.description || `Explore our beautiful collection of ${tag.name.toLowerCase()}.`,
  }));
}
