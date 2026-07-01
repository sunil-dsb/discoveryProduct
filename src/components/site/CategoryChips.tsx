"use client";
import Link from "next/link";
import { useRef, useState } from "react";

export function CategoryChips({ activeSlug, categories }: { activeSlug?: string; categories: any[] }) {
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
    const walk = (x - startX) * 2; // scroll-fast
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <div 
      ref={scrollRef}
      className={`flex gap-2.5 overflow-x-auto no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 md:[mask-image:linear-gradient(to_right,white_85%,transparent)] pb-1 md:pb-0 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
    >
      <Link
        href="/browse"
        className={`chip whitespace-nowrap shrink-0 transition-colors ${!activeSlug ? "chip-active" : ""}`}
        draggable={false}
      >
        All
      </Link>
      {categories?.map((c) => (
        <Link
          key={c.id}
          href={`/browse?category=${c.id}`}
          className={`chip whitespace-nowrap shrink-0 transition-colors  ${String(activeSlug) === String(c.id) ? "chip-active" : ""}`}
          draggable={false}
        >
          {c.name}
        </Link>
      ))}
      <div className="w-6 shrink-0 md:hidden" />
    </div>
  );
}
