"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const announcements = [
  <>✨ Summer Season Offer - <span className="underline cursor-pointer hover:text-white/80 transition-colors">upto 50% OFF*</span> ✨</>,
  <>🚚 Free Shipping on all orders over <span className="underline cursor-pointer hover:text-white/80 transition-colors">$100</span></>,
  <>🎁 Sign up & get <span className="underline cursor-pointer hover:text-white/80 transition-colors">15% off your first order</span></>
];

export function Nav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  useEffect(() => {
    if (!showAnnouncement) return;
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [showAnnouncement]);

  const links = [
    { to: "/", label: "Discover" },
    { to: "/browse", label: "Browse" },
    { to: "/brands", label: "Brands" },
  ] as const;

  return (
    <>
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-black text-white px-4 py-2.5 flex items-center justify-center relative text-xs font-medium tracking-wide h-9 overflow-hidden">
          <div className="relative w-full max-w-xl h-full flex items-center justify-center">
            {announcements.map((ann, i) => (
              <p 
                key={i} 
                className={`absolute text-center w-full transition-opacity duration-700 ${
                  i === currentAnnouncementIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {ann}
              </p>
            ))}
          </div>
          <button 
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
            aria-label="Close announcement"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-background border-b border-line w-full">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
          <span className="grid place-items-center size-7 rounded-md bg-primary text-primary-foreground font-display text-lg leading-none pt-0.5">h.</span>
          <span className="font-display text-xl tracking-tight">home goods</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                href={l.to}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button className="hidden sm:inline-flex h-9 px-4 rounded-full text-sm font-medium bg-ink text-background hover:opacity-90 transition-opacity text-center items-center justify-center">
            Sign in
          </button>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex md:hidden size-9 items-center justify-center rounded-full border border-line hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-line bg-background absolute top-full left-0 w-full px-6 py-6 space-y-4 shadow-lg">
          <nav className="flex flex-col gap-2">
            {links.map((l) => {
              const active = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  href={l.to}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 text-sm rounded-xl transition-colors ${
                    active ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-4 border-t border-line">
            <button className="w-full h-11 rounded-full text-sm font-medium bg-ink text-background hover:opacity-90 transition-opacity flex items-center justify-center">
              Sign in
            </button>
          </div>
        </div>
      )}
      </header>
    </>
  );
}
