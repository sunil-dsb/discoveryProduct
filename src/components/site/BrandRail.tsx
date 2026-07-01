"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

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

export function BrandRail({ brands, products }: { brands: any[], products?: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="py-2">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-2 opacity-50">Pioneer Brands</p>
          <h2 className="font-display text-3xl md:text-4xl">The houses we follow</h2>
        </div>
        <Link href="/brands" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
          All {brands.length} brands <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div
        ref={scrollRef}
        className={`flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {brands.map((b, i) => {
          const imageSrc = HARDCODED_IMAGES[i % 16];
          return (
            <Link
              key={b.id}
              href={`/browse?brand=${b.id}`}
              className="group relative flex-none w-54 h-60 rounded-2xl overflow-hidden hover:shadow-lift animate-float-in flex flex-col isolate transform-gpu"
              style={{ animationDelay: `${i * 40}ms` }}
              draggable={false}
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0 bg-secondary">
                <img src={imageSrc} alt="" className="size-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-2xl" />
              </div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 z-10 pointer-events-none" />

              {/* Content */}
              <div className="relative z-20 p-6 flex flex-col h-full justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground bg-white/60 px-2 py-1 rounded-md backdrop-blur-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-display text-2xl text-background">{b.name}</h3>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-muted-background">{b.origin}</p>
                    <p className="text-xs font-mono text-background">{b.productCount} items</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
