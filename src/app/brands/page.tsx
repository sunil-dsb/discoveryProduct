import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { getBrands, getProducts } from "@/lib/api";

const HARDCODED_IMAGES = [
  "https://ellementry.com/cdn/shop/files/Cookware.jpg?v=1772474900&width=500",
  "https://www.ellementry.com/cdn/shop/files/01Lifestyle_80eacd31-cb15-4d06-bf58-7e270ae59fea_400x.jpg?v=1780048739",
  "https://ellementry.com/cdn/shop/files/Coffee-_-Tea.jpg?v=1772475141&width=500",
  "https://www.ellementry.com/cdn/shop/files/wdfna2794_01_93c71a52-b432-4b40-b731-03a179453309_665x.jpg?v=1780563990",
  "https://ellementry.com/cdn/shop/files/Barware.jpg?v=1772475140&width=500",
  "https://ellementry.com/cdn/shop/files/wdfna2788_02_665x.jpg?v=1780554913",
  "https://ellementry.com/cdn/shop/files/Cutlery.jpg?v=1772475025&width=500",
  "https://ellementry.com/cdn/shop/files/Drinkware.jpg?v=1772475025&width=500",
  "https://www.ellementry.com/cdn/shop/files/Dinnerware_ff0590a5-f2da-4096-901c-6b8d3b758a40.jpg?v=1772694113&width=500",
  "https://ellementry.com/cdn/shop/files/Utilities.jpg?v=1772474901&width=500",
  "https://www.ellementry.com/cdn/shop/files/Organiser_c3ee5bd5-bd02-4b9f-8183-a984dd02cca4.jpg?v=1772474900&width=500",
  "https://www.ellementry.com/cdn/shop/files/Dessert-_-Appetizers.jpg?v=1772475140&width=500",
  "https://ellementry.com/cdn/shop/files/Bakeware.jpg?v=1772474900&width=500",
  "https://www.ellementry.com/cdn/shop/collections/MADEA3397_00.webp?v=1774343000&width=600",
  "https://ellementry.com/cdn/shop/files/bottle_-_spotlight.png?v=1771509035&width=700",
  "https://ellementry.com/cdn/shop/collections/swtea2415_00.jpg?v=1776679347&width=600"
];

export default async function Page() {
  const brands = await getBrands();
  const { products } = await getProducts();
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-3 opacity-50">Brands</p>
          <h1 className="font-display text-5xl sm:text-6xl">The houses<br /><em className="italic">we follow.</em></h1>
          <p className="mt-5 text-muted-foreground">Independent ateliers, design houses, and small studios each invited and reviewed by our editors.</p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((b: any, i: number) => {
            const imageSrc = HARDCODED_IMAGES[i % 16];
            return (
              <Link
                key={b.id}
                href={`/browse?brand=${b.id}`}
                className="group relative w-full aspect-[4/3] rounded-2xl overflow-hidden isolate animate-float-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <img src={imageSrc} alt="" className="absolute inset-0 size-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]" />
                
                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white pointer-events-none">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-white/80">
                      NO. {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Minimalist accent dot */}
                    <div className={`size-2.5 rounded-full ${b.accent} shadow-sm border border-white/20`} />
                  </div>
                  
                  <div className="translate-y-10 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
                    <h3 className="font-display text-3xl mb-1.5 text-white">{b.name}</h3>
                    
                    <p className="text-xs text-white/80 line-clamp-2 mb-3 max-w-[95%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                      {b.description || "A curated collection of exceptional home essentials, designed to elevate your everyday living spaces."}
                    </p>
                    
                    <div className="flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <span className="text-sm font-medium text-white/90">{b.origin}</span>
                      <span className="size-1 rounded-full bg-white/40" />
                      <span className="font-mono text-[11px] text-white/90">{b.productCount} objects</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
