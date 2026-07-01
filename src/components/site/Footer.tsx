const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

export function Footer() {
  return (
    <footer className="border-t border-line mt-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 grid gap-12 lg:gap-8 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="grid place-items-center size-8 rounded-md bg-primary text-primary-foreground font-display text-xl leading-none pt-0.5">h</span>
            <span className="font-display text-2xl tracking-tight">home goods</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A discovery platform for considered objects. Not a marketplace, a quiet room to find what lasts. Elevate your everyday living.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <a href="#" className="p-2 -ml-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-full transition-all" aria-label="Instagram">
              <InstagramIcon className="size-4" />
            </a>
            <a href="#" className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-full transition-all" aria-label="Twitter">
              <TwitterIcon className="size-4" />
            </a>
            <a href="#" className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-full transition-all" aria-label="Facebook">
              <FacebookIcon className="size-4" />
            </a>
            <a href="#" className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-full transition-all" aria-label="Youtube">
              <YoutubeIcon className="size-4" />
            </a>
          </div>
        </div>
        
        {[
          { h: "Discover", l: ["Collections", "Brands", "New arrivals", "Editor picks"] },
          { h: "About", l: ["Our editors", "How we curate", "Submit a brand", "Press"] },
          { h: "Support", l: ["Help center", "Terms of service", "Privacy policy", "Contact us"] },
        ].map((g) => (
          <div key={g.h}>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground mb-6">{g.h}</p>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {g.l.map((i) => (
                <li key={i}>
                  <a href="#" className="hover:text-foreground hover:underline underline-offset-4 transition-all">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="border-t border-line">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Home Goods. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
