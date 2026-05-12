import React, { useState, useEffect, useRef } from "react";
import Auth from "./Auth";
import AdminApp from "./admin/AdminApp";
import PublicCourses from "./PublicCourses";
import PublicFAQ from "./PublicFAQ";
import PublicTestimonials from "./PublicTestimonials";
import { apiFetch } from "./admin/useAdminApi";

/* ── Logo Icon ─────────────────────────────────────────── */


/* ── Inline SVG icons ───────────────────────────────────── */
const ArrowRightIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const ChevDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const PlayIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="18" fill="white" opacity="0.95" />
    <polygon points="14,10 28,18 14,26" fill="#6B47DC" />
  </svg>
);
const FeatureIcons = {
  guidance: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  support: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  ),
  university: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  visa: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
};
const ServiceSVGs = {
  hat: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  university: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  application: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  visa: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /><line x1="8" y1="15" x2="10" y2="15" /><line x1="12" y1="15" x2="16" y2="15" />
    </svg>
  ),
  arrival: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l3-3 4 4 4-8 4 4" /><path d="M21 21H3" />
    </svg>
  ),
};

/* ── Header ─────────────────────────────────────────────── */
function Header() {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("auth_user") || "null"); } catch { return null; }
  });

  useEffect(() => {
    const handler = () => {
      try { setUser(JSON.parse(localStorage.getItem("auth_user") || "null")); } catch { setUser(null); }
    };
    window.addEventListener("authChange", handler);
    return () => window.removeEventListener("authChange", handler);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About Us", href: "#about" },
    { label: "Services", href: "#services" },
    // { label: "Destinations", href: "#destinations" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
    <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-border/40 h-[50px] md:h-[100px] flex items-center overflow-visible">
      <div className="container mx-auto px-0 md:px-4 md:pr-8 flex items-center justify-between w-full h-full pb-1">
        {/* Brand */}
        <div className="flex items-center shrink-0 w-[180px] md:w-[260px] h-full relative overflow-hidden">
          <a href="#home" className="block absolute top-1/2 -translate-y-1/2 left-0 z-50">
            <img
              src="https://res.cloudinary.com/dtwcgfmar/image/upload/v1777557258/images/osrzkwmrt33dlpzyofze.png"
              alt="Ajinorah"
              className="h-[350px] md:h-[810px] w-auto block transition-all hover:scale-105 object-contain object-left origin-left"
            />
          </a>
        </div>

        {/* Navigation */}
        <nav className={`
          ${open ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-4 opacity-0 pointer-events-none"} 
          flex md:flex md:translate-y-0 md:opacity-100 md:pointer-events-auto 
          absolute md:static left-0 right-0 top-[100px] bg-white md:bg-transparent 
          p-4 md:p-0 flex-col md:flex-row items-stretch md:items-center gap-0 md:gap-1 md:flex-1 md:mx-6 z-50 
          shadow-xl md:shadow-none border-b md:border-none border-border/20 transition-all duration-300 ease-in-out
        `}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative px-4 py-4 md:py-2 text-[16px] md:text-[14.5px] font-bold md:font-semibold text-dark md:text-muted/90 transition-all border-b border-border/10 md:border-none last:border-none hover:bg-bg-soft md:hover:bg-transparent hover:text-primary group whitespace-nowrap"
              onClick={() => setOpen(false)}
            >
              {link.label}
              <span className="hidden md:block absolute bottom-1.5 left-4 right-4 h-0.5 bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
          {/* Mobile-only auth action inside the collapsed menu */}
          {user ? (
            <div className="md:hidden px-4 py-3 border-t border-border/10 flex items-center justify-between">
              <span className="font-medium">Hello, {user.name}</span>
              <button onClick={() => { localStorage.removeItem("auth_token"); localStorage.removeItem("auth_user"); window.dispatchEvent(new Event("authChange")); setOpen(false); }} className="text-sm text-red-500">Logout</button>
            </div>
          ) : (
            <div className="md:hidden px-4 py-3 border-t border-border/10">
              <button onClick={() => { setAuthOpen(true); setOpen(false); }} className="w-full bg-primary text-white py-2 rounded-lg font-semibold">Login / Register</button>
            </div>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 lg:gap-4 ml-4 shrink-0 pr-2">
          <div className="hidden xl:flex items-center gap-2 mr-2">
            <a href="https://x.com/Ajinorah_Maha" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61586724492187" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://www.instagram.com/ajinorahmaharashtra" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://www.youtube.com/@ajinorahmaharashtra" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
            <a href="https://www.linkedin.com/in/ajinorah-maharashtra-2316413a7/" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="https://wa.me/919170065003" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center text-muted hover:text-[#25D366] hover:bg-[#25D366]/10 transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.338 11.897-11.896a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </a>
          </div>
          <a
            href="https://wa.me/919170065003"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-white px-5 py-3 rounded-full font-bold text-[13.5px] shadow-[0_10px_25px_-5px_rgba(107,71,220,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(107,71,220,0.4)] hover:-translate-y-0.5 transition-all hidden md:inline-flex items-center gap-2"
          >
            Enquire Now <ArrowRightIcon size={16} />
          </a>
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'admin' && (
                  <a href="#/admin/dashboard" className="text-sm text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/5 font-medium">Admin</a>
                )}
                <button onClick={() => { localStorage.removeItem("auth_token"); localStorage.removeItem("auth_user"); window.dispatchEvent(new Event("authChange")); }} className="text-sm text-red-500">Logout</button>
              </div>
            ) : (
              <button onClick={() => setAuthOpen(true)} className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">Login</button>
            )}
          </div>
          <button
            className="rounded-xl md:hidden transition-all text-black border border-border/50 hover:bg-bg-soft"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <MenuIcon />
            )}
          </button>
        </div>
      </div>
    </header>
    {authOpen && <Auth open={true} onClose={() => setAuthOpen(false)} />}
    </>
  );
}

/* ── Hero ────────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="home" className="relative overflow-hidden min-h-[500px] flex items-center pt-6 md:pt-12 pb-2">
      <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-2 items-center gap-0">
        {/* Left Content */}
        <div className="max-w-[540px]">
          <p className="inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[0.12em] text-teal uppercase mb-[18px]">
            <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />
            GET SET FLY
          </p>
          <h1 className="text-4xl md:text-[56px] font-extrabold leading-[1.12] text-dark mb-[18px] tracking-tight">
            Your Dream.<br />
            Our Guidance.<br />
            <span className="gradient-text">Global Success.</span>
          </h1>
          <p className="text-[15.5px] text-muted leading-relaxed mb-7">
            Ajinorah Maharashtra helps ambitious students gain admission to<br />
            top universities worldwide with a focus on 100% scholarships.
          </p>
          <div className="flex items-center gap-3.5 mb-9 flex-wrap">
            <a href="https://wa.me/919170065003" target="_blank" rel="noopener noreferrer" className="bg-primary text-white shadow-[0_4px_18px_rgba(107,71,220,0.32)] hover:bg-primary-dark hover:shadow-[0_6px_24px_rgba(107,71,220,0.40)] hover:-translate-y-[1px] inline-flex items-center gap-2 px-[22px] py-3 rounded-full font-semibold text-[14.5px] whitespace-nowrap transition-all duration-200">
              Book Free Consultation <ArrowRightIcon />
            </a>
            <a href="#destinations" className="bg-transparent text-dark border-[1.5px] border-border hover:border-primary hover:text-primary inline-flex items-center gap-2 px-[22px] py-3 rounded-full font-semibold text-[14.5px] whitespace-nowrap transition-all duration-200">
              Explore Destinations <ArrowRightIcon />
            </a>
          </div>

          <div className="grid grid-cols-4 gap-2 md:gap-4 pt-6 border-t border-border/50 w-full">
            {[
              { icon: FeatureIcons.guidance, label: "100%\nScholarships" },
              { icon: FeatureIcons.support, label: "End-to-End\nSupport" },
              { icon: FeatureIcons.university, label: "Global\nNetwork" },
              { icon: FeatureIcons.visa, label: "95% Visa\nSuccess" },
            ].map((f) => (
              <div key={f.label} className="flex flex-col xl:flex-row items-center xl:items-start text-center xl:text-left gap-1.5 md:gap-2.5">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-bg-soft border border-border/50 flex items-center justify-center shrink-0 text-primary">{f.icon}</div>
                <span className="text-[9.5px] md:text-[11px] font-bold text-dark whitespace-pre-line leading-[1.2]">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Visual */}
        <div className="flex justify-center items-center h-[400px] md:h-[500px] relative z-10">
          <div className="relative w-full max-w-[850px] h-full flex items-center justify-center">

            <img
              src="https://res.cloudinary.com/dtwcgfmar/image/upload/v1777724841/Untitled_design_58_gtqso7.png"
              alt="Student"
              className="absolute top-1/2 -translate-x-20 md:-translate-x-1/2 -translate-y-1/2 w-full h-full object-contain z-10 scale-125"
            />
            <a href="https://youtube.com/shorts/2rZzWat_alY?si=C0k2dHejGZflkZqq">
              <div className="absolute bottom-[85px] md:bottom-[40px] right-6 md:-right-[10px] bg-white rounded-2xl shadow-lg p-2.5 md:p-4 flex items-center gap-3 z-20 min-w-[140px] md:min-w-[210px] border border-border/50">
                <div className="shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary scale-75 md:scale-100"><PlayIcon /></div>
                <div className="flex flex-col gap-0">
                  <span className="text-[11px] md:text-[14.5px] font-bold text-dark">Join 1 Lakh+ Students</span>
                  <span className="text-[9px] md:text-[12px] text-muted">Global Network</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Trusted Universities ────────────────────────────────── */
function TrustedBy() {
  const unis = [
    { abbr: "MY", name: "Malaysia\nInstitutions" },
    { abbr: "MU", name: "Mauritius\nPartners" },
    { abbr: "DE", name: "Germany\nUniversities" },
    { abbr: "FR", name: "France\nSchools" },
    { abbr: "UZ", name: "Uzbekistan\nAllies" },
    { abbr: "AL", name: "Albania\nNetwork" },
    { abbr: "AE", name: "Dubai\nGlobal Hub" },
    { abbr: "100%", name: "Scholarship\nPrograms" },
    { abbr: "INTL", name: "Budget\nStudy Pathways" },
  ];

  return (
    <section className="py-12 border-y border-border bg-[#FAFBFF] overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <p className="text-center text-[11.5px] font-bold tracking-[0.12em] text-muted uppercase mb-10">OUR GLOBAL PARTNER NETWORK ACROSS 7+ COUNTRIES</p>

        <div className="relative flex overflow-hidden no-scrollbar">
          <div className="animate-marquee gap-12 md:gap-20 no-scrollbar">
            {[...unis, ...unis].map((u, i) => (
              <div key={i} className="flex items-center gap-3 opacity-60 transition-opacity hover:opacity-100 shrink-0">
                {u.abbr && <span className="text-[28px] md:text-[32px] font-black text-dark tracking-tighter leading-none">{u.abbr}</span>}
                <span className="text-[10px] md:text-[11px] font-bold text-dark uppercase tracking-[0.06em] whitespace-pre-line leading-tight">{u.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Destinations ────────────────────────────────────────── */
function Destinations() {
  const [showAll, setShowAll] = React.useState(false);

  const countries = [
    {
      name: "Malaysia",
      flag: "🇲🇾",
      desc: "Top scholarship options & vibrant culture.",
      img: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400&h=220&fit=crop&q=80",
    },
    {
      name: "Mauritius",
      flag: "🇲🇺",
      desc: "High-quality education in a tropical paradise.",
      img: "https://images.unsplash.com/photo-1582574643306-d00ea3f7d49b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWF1cml0aXVzfGVufDB8fDB8fHww",
    },
    {
      name: "France",
      flag: "🇫🇷",
      desc: "Rich academic tradition and career opportunities.",
      img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=220&fit=crop&q=80",
    },
    {
      name: "Germany",
      flag: "🇩🇪",
      desc: "Low-cost education with world-class engineering.",
      img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=220&fit=crop&q=80",
    },
    {
      name: "Dubai",
      flag: "🇦🇪",
      desc: "Modern hub for global business and innovation.",
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=220&fit=crop&q=80",
    },
    {
      name: "Albania",
      flag: "🇦🇱",
      desc: "Emerging destination with affordable medical programs.",
      img: "https://plus.unsplash.com/premium_photo-1697730104948-43575659bf0a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWxiYW5pYXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      name: "Uzbekistan",
      flag: "🇺🇿",
      desc: "Excellent opportunities for medical and technical studies.",
      img: "https://images.unsplash.com/photo-1670514535515-e7af911bdadb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fFV6YmVraXN0YW58ZW58MHx8MHx8fDA%3D",
    },
  ];

  const displayedCountries = showAll ? countries : countries.slice(0, 3);

  return (
    <section id="destinations" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-[280px_1fr] items-start gap-12">
        <div className="text-center md:text-left">
          <p className="text-[11px] font-bold tracking-[0.14em] text-teal uppercase mb-3.5">POPULAR DESTINATIONS</p>
          <h2 className="text-4xl font-extrabold text-dark leading-[1.12] mb-4 tracking-tight">Explore Top Study<br />Abroad Destinations</h2>
          <p className="text-[14.5px] text-muted leading-relaxed mb-6">
            Choose from the world's best countries<br />and top-ranked universities.
          </p>
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-[7px] text-sm font-semibold text-primary transition-all hover:gap-[11px] justify-center md:justify-start"
          >
            {showAll ? "Show Less" : "View All Countries"} <ArrowRightIcon />
          </button>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayedCountries.map((c) => (
              <a
                key={c.name}
                href={`https://wa.me/919170065003?text=${encodeURIComponent(`Hello, I'm interested in studying in ${c.name}. ${c.desc}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-border transition-all hover:-translate-y-1 hover:shadow-md group block"
              >
                <div className="h-[140px] overflow-hidden">
                  <img src={c.img} alt={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-3.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[13.5px] font-bold text-dark">{c.name}</span>
                  </div>
                  <p className="text-[12px] text-muted leading-relaxed mb-2.5">{c.desc}</p>
                  <div className="w-7 h-7 rounded-full bg-bg-soft border border-border flex items-center justify-center text-primary text-[13px] transition-colors group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                    <ArrowRightIcon size={14} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Services ────────────────────────────────────────────── */
function Services() {
  const [activeService, setActiveService] = useState(null);
  const serviceDetails = {
  scholarship: {
    title: "Scholarship Assistance",
    tagline: "100% funded & sponsored opportunities",
    points: [
      "Fully funded university scholarships in Europe, UK, USA & Canada",
      "Personalized scholarship matching based on your profile",
      "Application review & SOP writing support",
      "Interview preparation for scholarship panels",
      "Ongoing updates on new scholarship openings",
    ],
  },
  coaching: {
    title: "IELTS / TOEFL Coaching",
    tagline: "Expert training to ace your language tests",
    points: [
      "Structured batch & one-on-one coaching sessions",
      "Experienced trainers with proven track records",
      "Mock tests with detailed performance feedback",
      "Targeted modules for Reading, Writing, Listening & Speaking",
      "Flexible schedules for working professionals & students",
    ],
  },
  counseling: {
    title: "Abroad Study Counseling",
    tagline: "End-to-end guidance from selection to departure",
    points: [
      "University shortlisting based on profile & budget",
      "Application filing & documentation assistance",
      "SOP, LOR & resume writing support",
      "Scholarship & financial aid guidance",
      "Pre-departure orientation & cultural briefing",
    ],
  },
  visa: {
    title: "Visa Processing Support",
    tagline: "High success rate with personalized assistance",
    points: [
      "Step-by-step visa application guidance",
      "Document checklist & verification support",
      "Mock visa interview preparation",
      "Follow-up with embassies & consulates",
      "Handling of rejections & re-applications",
    ],
  },
  corporate: {
    title: "Corporate Training",
    tagline: "Upskilling programs for professionals & students",
    points: [
      "Customized training programs for organizations",
      "Soft skills, communication & leadership workshops",
      "Language proficiency training for corporate teams",
      "Certification programs recognized internationally",
      "In-house & remote training options available",
    ],
  },
};
  const services = [
    { key: "scholarship", icon: ServiceSVGs.hat, color: "#FFF3EC", stroke: "#FF6B35", title: "Scholarship Assistance", desc: "Specializing in 100% funded and sponsored opportunities." },
    { key: "coaching", icon: ServiceSVGs.university, color: "#FFFBEB", stroke: "#F59E0B", title: "IELTS / TOEFL Coaching", desc: "Expert training to ace your language proficiency tests." },
    { key: "counseling", icon: ServiceSVGs.application, color: "#F0FDF4", stroke: "#22C55E", title: "Abroad Study Counseling", desc: "End-to-end guidance from selection to pre-departure." },
    { key: "visa", icon: ServiceSVGs.visa, color: "#EFF6FF", stroke: "#3B82F6", title: "Visa Processing Support", desc: "High success rate with personalized visa assistance." },
    { key: "corporate", icon: ServiceSVGs.arrival, color: "#F5F3FF", stroke: "#8B5CF6", title: "Corporate Training", desc: "Upskilling programs for professionals and students alike." },
  ];
const detail = activeService ? serviceDetails[activeService.key] : null;

  const openPopup = (s) => {
    setActiveService(s);
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    setActiveService(null);
    document.body.style.overflow = '';
  };

  const handleWhatsApp = () => {
    const s = activeService;
    const message = `Hi, I'm interested in your ${s.title} service: ${s.desc}. I'd like to know more about ${s.title} and the programs you provide.`;
    window.open(`https://wa.me/919170065003?text=${encodeURIComponent(message)}`, '_blank');
  };
  return (
    <section id="services" className="py-20 bg-bg-soft">
      <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-[280px_1fr] items-start gap-12">
        <div className="text-center md:text-left">
          <p className="text-[11px] font-bold tracking-[0.14em] text-teal uppercase mb-3.5">OUR SERVICES</p>
          <h2 className="text-4xl font-extrabold text-dark leading-[1.12] mb-4 tracking-tight">We're with you<br />at every step</h2>
          <div className="w-10 h-[3px] bg-orange rounded-sm mb-[18px] mx-auto md:mx-0" />
          <p className="text-[14.5px] text-muted leading-relaxed mb-6">
            From shortlisting to visa approval and<br />
            beyond — we make your study abroad<br />
            journey smooth and successful.
          </p>
          <a href="#" className="inline-flex items-center gap-[7px] text-sm font-semibold text-primary transition-all hover:gap-[11px] justify-center md:justify-start">View All Services <ArrowRightIcon /></a>
        </div>

        <div className="flex flex-col gap-3.5">
        {services.map((s) => (
          <button
            key={s.key}
            onClick={() => openPopup(s)}
            className="bg-[linear-gradient(to_right,#fff1f2,#fef3c7,#ecfdf5,#eff6ff,#f5f3ff)] rounded-2xl p-[20px] flex items-start gap-4 shadow-sm border border-white transition-all hover:shadow-md hover:-translate-y-1 group h-auto text-left w-full"
          >
            <div
              className="w-[50px] h-[50px] bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ color: s.stroke }}
            >
              {s.icon}
            </div>
            <div>
              <h4 className="text-[14.5px] font-bold text-dark mb-1">{s.title}</h4>
              <p className="text-xs text-dark/70 font-medium leading-relaxed">{s.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Backdrop */}
      {activeService && (
        <div
          className="fixed inset-0 z-[400] bg-black/50"
          onClick={closePopup}
        />
      )}

      {/* Bottom Sheet */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-[500] bg-white rounded-t-3xl transition-transform duration-300 ease-out ${
          activeService ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '82vh', overflowY: 'auto' }}
      >
        {activeService && detail && (
          <>
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between px-5 pt-3 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: activeService.color, color: activeService.stroke }}
                >
                  {activeService.icon}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-dark leading-tight">{detail.title}</h3>
                  <p className="text-xs text-dark/50 mt-0.5">{detail.tagline}</p>
                </div>
              </div>
              <button
                onClick={closePopup}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0 ml-3 mt-0.5"
              >
                ✕
              </button>
            </div>

            {/* Points */}
            <ul className="px-5 pt-4 pb-2 flex flex-col gap-3">
              {detail.points.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold"
                    style={{ background: activeService.color, color: activeService.stroke }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm text-dark/80 leading-relaxed">{point}</p>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="px-5 pt-4 pb-8">
              <button
                onClick={handleWhatsApp}
                className="w-[200px] py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{ background: activeService.stroke }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Enquire on WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
      </div>
    </section>
  );
}

/* ── Blogs ───────────────────────────────────────────────── */
function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/blogs')
      .then((res) => res.ok ? res.json() : [])
      .then((data) => { if (mounted) setBlogs(Array.isArray(data) ? data : []); })
      .catch(() => { if (mounted) setBlogs([]); });
    return () => { mounted = false; };
  }, []);

  if (!blogs || blogs.length === 0) return null;

  return (
    <section id="blogs" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <p className="text-center text-[11.5px] font-bold tracking-[0.12em] text-teal uppercase mb-4">FROM OUR BLOG</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-dark text-center mb-8">Latest Articles & News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <article key={b.id} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              {b.coverImage && (
                <div className="h-44 w-full overflow-hidden">
                  <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold text-dark mb-2">{b.title}</h3>
                <p className="text-sm text-muted mb-3">{b.excerpt}</p>
                <a href={`#/blog/${b.slug || b.id}`} className="text-sm font-semibold text-primary">Read more →</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Events Section ─────────────────────────────────────── */
function Events() {
  const items = [
    {
      id: 1,
      type: 'video',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/1.mp4',
      },
      {
      id: 15,
      type: 'video',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/15.mp4',
      },
      {
      id: 16,
      type: 'video',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/16.mp4',
      },
      {
      id: 17,
      type: 'video',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/17.mp4',
      },
      {
      id: 19,
      type: 'video',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/19.mp4',
      },
      {
      id: 2,
      type: 'video',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/2.mp4',
      },
      {
      id: 20,
      type: 'video',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/20.mp4',
      },
      {
      id: 21,
      type: 'video',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/21.mp4',
      },
      {
      id: 22,
      type: 'video',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/22.mp4',
      },
      {
      id: 44,
      type: 'video',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/44.mp4',
      },
    {
      id: 10,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/10.jpeg',
      },
    {
      id: 11,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/11.jpeg',
      },
      {
      id: 12,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/12.jpeg',
      },
    {
      id: 13,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/13.jpeg',
      },
    {
      id: 14,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/14.jpeg',
      },
    {
      id: 18,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/18.jpeg',
      },
      {
      id: 23,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/23.jpeg',
      },
    {
      id: 24,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/24.jpeg',
      },
      {
      id: 25,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/25.jpeg',
      },
    {
      id: 26,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/26.jpeg',
      },
    {
      id: 27,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/27.jpeg',
      },
    {
      id: 28,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/28.jpeg',
      },
      {
      id: 29,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/29.jpeg',
      },
      {
      id: 3,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/3.jpeg',
      },
      {
      id: 30,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/30.jpeg',
      },
      {
      id: 31,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/31.jpeg',
      },
      {
      id: 32,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/32.jpeg',
      },
    {
      id: 33,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/33.jpeg',
      },
    {
      id: 34,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/34.jpeg',
      },
      {
      id: 35,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/35.jpeg',
      },
      {
      id: 36,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/36.jpeg',
      },
      {
      id: 37,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/37.jpeg',
      },
      {
      id: 38,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/38.jpeg',
      },
      {
      id: 39,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/39.jpeg',
      },
      {
      id: 4,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/4.jpeg',
      },
      {
      id: 40,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/40.jpeg',
      },
      {
      id: 41,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/41.jpeg',
      },
      {
      id: 42,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/42.jpeg',
      },
      {
      id: 43,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/43.jpeg',
      },
      {
      id: 45,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/45.jpeg',
      },
      {
      id: 5,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/5.jpeg',
      },
      {
      id: 6,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/6.jpeg',
      },
      {
      id: 7,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/7.jpeg',
      },
      {
      id: 8,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/8.jpeg',
      },
      {
      id: 9,
      type: 'image',
      src: 'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Event%20Image/9.jpeg',
      },
  ];

  const [modalItem, setModalItem] = useState(null);
  const [orientation, setOrientation] = useState('landscape');
  const modalRef = useRef(null);

  const openMedia = (it, e) => {
    e?.preventDefault();
    // Determine orientation for images/videos
    if (it.type === 'image') {
      const img = new Image();
      img.onload = () => {
        setOrientation(img.naturalHeight > img.naturalWidth ? 'portrait' : 'landscape');
        setModalItem(it);
      };
      img.src = it.src;
    } else if (it.type === 'video') {
      const v = document.createElement('video');
      v.onloadedmetadata = () => {
        setOrientation(v.videoHeight > v.videoWidth ? 'portrait' : 'landscape');
        setModalItem(it);
      };
      v.src = it.src;
      v.load();
    }
  };

  const closeModal = () => {
    setModalItem(null);
  };

  useEffect(() => {
    const onKey = (ev) => { if (ev.key === 'Escape') closeModal(); };
    if (modalItem) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalItem]);

  return (
    <section id="events" className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <p className="text-center text-[11.5px] font-bold tracking-[0.12em] text-teal uppercase mb-4">EVENTS</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-dark text-center mb-8">Recent Events & Highlights</h2>

        <div className="events-scroller">
          <div
            className="events-track"
            onMouseEnter={(e) => { e.currentTarget.style.animationPlayState = 'paused'; }}
            onMouseLeave={(e) => { e.currentTarget.style.animationPlayState = 'running'; }}
          >
            {[...items, ...items].map((it, idx) => (
              <div key={`${it.id}-${idx}`} className="events-item flex-shrink-0 min-w-[260px] md:min-w-[320px]">
                <article className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                  <button onClick={(e) => openMedia(it, e)} className="w-full text-left">
                    <div className="h-60 w-full overflow-hidden flex items-center justify-center bg-bg-soft">
                      {it.type === 'video' ? (
                        <video className="w-full h-full object-cover" muted>
                          <source src={it.src} type="video/mp4" />
                        </video>
                      ) : (
                        <img src={it.src} alt={it.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                  </button>
                </article>
              </div>
            ))}
          </div>
        </div>

        {modalItem && (
          <div ref={modalRef} className={`media-modal fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 ${orientation}`} onClick={closeModal} role="dialog" aria-modal="true">
            <div className="media-content max-w-full max-h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              {modalItem.type === 'video' ? (
                <video controls autoPlay className="max-w-full max-h-full">
                  <source src={modalItem.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={modalItem.src} alt={modalItem.title} className="max-w-full max-h-full object-contain" />
              )}
            </div>
            <button onClick={closeModal} className="media-close absolute top-6 right-6 text-white bg-black/30 rounded-full p-2">✕</button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── CTA Banner ──────────────────────────────────────────── */
function CTABanner() {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-[#F0EEFF] to-[#EEF5FF] rounded-[28px] mx-4 md:mx-8 mb-[60px] p-8 overflow-hidden relative">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-12 gap-8 relative z-10">
        <div className="max-w-[480px] text-center md:text-left">
          <h2 className="text-3xl md:text-[42px] font-extrabold text-dark leading-[1.18] mb-4 tracking-tight">
            Ready to Start Your<br />
            <span className="gradient-text-orange">Study Abroad</span> Journey?
          </h2>
          <p className="text-base text-muted leading-relaxed mb-7">
            Book your free consultation today and take<br />
            the first step towards your global future.
          </p>
          <a href="https://wa.me/919170065003" target="_blank" rel="noopener noreferrer" className="bg-primary text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all inline-flex items-center gap-2">
            Book Free Consultation <ArrowRightIcon />
          </a>
        </div>
        <div className="relative w-full max-w-[480px] h-auto md:h-[340px] shrink-0 hidden md:block">
          <div className="absolute w-[320px] h-[320px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-primary/10 to-blue/10" />
          <img src="https://res.cloudinary.com/dtwcgfmar/image/upload/v1777735386/Untitled_design_60_zcftlx.png" alt="Ajinorah" className="relative w-full h-full object-contain" />
        </div>
      </div>
    </section>
  );
}

/* ── About Section ───────────────────────────────────────── */
function About() {
  return (
    <section id="about" className="py-20 relative overflow-hidden bg-[linear-gradient(135deg,#ffb3ba_0%,#ffdfba_20%,#ffffba_40%,#baffc9_60%,#bae1ff_80%,#cbaacb_100%)]">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-6 items-center relative z-10">
        <div className="text-center md:text-left">
          <p className="text-[11px] font-bold tracking-[0.14em] text-teal uppercase mb-3.5">WHO WE ARE</p>
          <h2 className="text-4xl font-extrabold text-dark leading-[1.12] mb-4 tracking-tight">Your Gateway to<br />Global Education</h2>
          <div className="w-10 h-[3px] bg-orange rounded-sm mb-[18px] mx-auto md:mx-0" />
          <p className="text-[14.5px] text-dark/80 font-medium leading-relaxed mb-6">
            Ajinorah Maharashtra is a global education consultancy dedicated to helping students access high-quality international education through <strong>fully funded and sponsored opportunities</strong>.
          </p>
        </div>
        <div className="flex flex-col gap-8">
          <div className="bg-white/60 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/50 shadow-sm">
            <h3 className="text-xl font-bold text-dark mb-4">Unique Selling Proposition (USP)</h3>
            <p className="text-[14.5px] text-dark/80 leading-relaxed mb-4">
              Our biggest differentiator is our strong focus on 100% scholarship and sponsorship-based education opportunities, which significantly reduces or completely eliminates the financial burden on students. Unlike traditional consultancies, we:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Prioritize fully funded and low-cost education options",
                "Offer access to emerging and high-opportunity countries",
                "Provide personalized guidance instead of a one-size-fits-all approach",
                "Maintain transparent processes with high success rates",
                "Focus on career-oriented programs and long-term outcomes, not just admissions"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] text-dark/80 leading-relaxed text-left">
                  <span className="text-primary mt-1 shrink-0"><ArrowRightIcon size={16} /></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-6 mt-2">
  
            <div className="bg-white/70 backdrop-blur-sm min-h-[110px] md:min-h-[130px] p-4 md:p-6 rounded-xl border border-white text-center transition-transform hover:-translate-y-1 shadow-sm flex flex-col justify-center items-center overflow-hidden">
              <span className="block text-2xl md:text-3xl font-extrabold text-primary mb-1 break-words">
                95%
              </span>
              <span className="text-[10px] md:text-xs font-bold text-dark/70 uppercase tracking-wide break-words">
                Visa Success
              </span>
            </div>

            <div className="bg-white/70 backdrop-blur-sm min-h-[110px] md:min-h-[130px] p-4 md:p-6 rounded-xl border border-white text-center transition-transform hover:-translate-y-1 shadow-sm flex flex-col justify-center items-center overflow-hidden">
              <span className="block text-lg md:text-3xl font-extrabold text-primary mb-1 break-words">
                1 Lakh+
              </span>
              <span className="text-[10px] md:text-xs font-bold text-dark/70 uppercase tracking-wide break-words">
                Students
              </span>
            </div>

            <div className="bg-white/70 backdrop-blur-sm min-h-[110px] md:min-h-[130px] p-4 md:p-6 rounded-xl border border-white text-center transition-transform hover:-translate-y-1 shadow-sm flex flex-col justify-center items-center overflow-hidden">
              <span className="block text-2xl md:text-3xl font-extrabold text-primary mb-1 break-words">
                100%
              </span>
              <span className="text-[10px] md:text-xs font-bold text-dark/70 uppercase tracking-wide break-words">
                Scholarships
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Visa Success Images ────────────────────────────────── */
function VisaSuccessImages() {
  const imgs = [
    'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Visa%20Success/1.jpeg',
    'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Visa%20Success/2.jpeg',
    'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Visa%20Success/3.jpeg',
    'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Visa%20Success/4.jpeg',
    'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Visa%20Success/5.jpeg',
    'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Visa%20Success/6.jpeg',
    'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Visa%20Success/7.jpeg',
    'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Visa%20Success/8.jpeg',
    'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Visa%20Success/9.jpeg',
    'https://pub-64e0d07ec6d7406799f8e82cfe7c07f7.r2.dev/ajinorah/Visa%20Success/10.jpeg',
  ];

  return (
    <section id="visa-success" className="py-8 bg-bg-soft">
      <div className="container mx-auto px-4 md:px-8">
        <p className="text-center text-[11.5px] font-bold tracking-[0.12em] text-teal uppercase mb-3">VISA SUCCESS</p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-dark text-center mb-6">Recent Visa Success Stories</h2>

        <div className="visa-scroller">
          <div
            className="visa-track"
            onMouseEnter={(e) => { e.currentTarget.style.animationPlayState = 'paused'; }}
            onMouseLeave={(e) => { e.currentTarget.style.animationPlayState = 'running'; }}
          >
            {[...imgs, ...imgs].map((src, idx) => (
              <div key={`${idx}`} className="visa-item flex-shrink-0 min-w-[180px] md:min-w-[220px]">
                <div className="bg-white/70 backdrop-blur-sm p-0 md:p-1 rounded-2xl border border-white shadow-sm overflow-hidden">
                  <img src={src} alt={`Visa success ${idx+1}`} className="w-full h-50 md:h-60 object-cover block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Contact Section ─────────────────────────────────────── */
function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    destination: "Select Destination",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit lead.");
      }
      setSubmitted(true);
      setFormData({ name: "", email: "", destination: "Select Destination", message: "" });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-bg-soft">
      <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-16 items-start">
        <div className="text-center md:text-left">
          <p className="text-[11px] font-bold tracking-[0.14em] text-teal uppercase mb-3.5">CONTACT US</p>
          <h2 className="text-4xl font-extrabold text-dark leading-snug mb-4 tracking-tight">Get in Touch</h2>
          <p className="text-[14.5px] text-muted leading-relaxed mb-6">Have questions? We are here to help you fly!</p>

          <div className="flex flex-col gap-6 mt-8">
            <div className="flex flex-col gap-1">
              <strong className="text-xs text-primary uppercase tracking-wider font-bold">Email:</strong>
              <a href="mailto:info@ajinorahmaharashtra.com" className="text-xs text-dark font-medium hover:text-primary transition-colors">info@ajinorahmaharashtra.com</a>
            </div>
            <div className="flex flex-col gap-1">
              <strong className="text-xs text-primary uppercase tracking-wider font-bold">Phone:</strong>
              <a href="tel:+919170065003" className="text-xs text-dark font-medium hover:text-primary transition-colors">+91 91 7006 5003, <br/>+91 887 2222 887, <br/>+91 86 5150 5150</a>
            </div>
            <div className="flex flex-col gap-0.5">
  <strong className="text-xs text-primary uppercase tracking-wide font-bold">
    Service Address:
  </strong>

  <p className="text-[10px] leading-tight text-dark font-medium">
    102, DEO ENCLAVE, NEAR DAHANUKAR MANAGEMENT COLLEGE, VILE PARLE EAST,
    MUMBAI, MAHARASHTRA - 400057
  </p>
</div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-[24px] shadow-lg border border-border/50">
          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h3 className="text-xl font-bold text-dark">Enquiry Sent!</h3>
              <p className="text-[14px] text-muted">Thank you, we'll be in touch shortly.</p>
              <button
                onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", destination: "Select Destination", message: "" }); }}
                className="mt-2 text-sm font-semibold text-primary underline underline-offset-2"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full px-[18px] py-3.5 rounded-xl border-[1.5px] border-border bg-bg-soft text-[14.5px] transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full px-[18px] py-3.5 rounded-xl border-[1.5px] border-border bg-bg-soft text-[14.5px] transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <select
              name="destination"
              className="w-full px-[18px] py-3.5 rounded-xl border-[1.5px] border-border bg-bg-soft text-[14.5px] transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white"
              value={formData.destination}
              onChange={handleChange}
            >
              <option disabled>Select Destination</option>
              <option>Malaysia</option>
              <option>Mauritius</option>
              <option>Germany</option>
              <option>France</option>
              <option>Other</option>
            </select>
            <textarea
              name="message"
              placeholder="Your Message"
              className="w-full px-[18px] py-3.5 rounded-xl border-[1.5px] border-border bg-bg-soft text-[14.5px] transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white min-h-[120px] resize-none"
              required
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            {submitError && (
              <p className="text-sm text-red-500 font-medium">{submitError}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-white w-full py-4 rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Sending…" : "Send"}
            </button>
          </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Lead Form ───────────────────────────────────────────── */
function LeadForm() {
  const [formData, setFormData] = useState({ name: '', email: '', destination: '', message: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/leads', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setSuccess(true);
      setFormData({ name: '', email: '', destination: '', message: '' });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h2>Submit a Lead</h2>
      {success && <p className="text-green-500">Lead submitted successfully!</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={formData.destination}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

/* ── App ─────────────────────────────────────────────────── */
export default function App() {
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash.startsWith('#/admin'));
  const [adminUser, setAdminUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('auth_user') || 'null'); } catch { return null; }
  });

  useEffect(() => {
    const check = () => {
      const onAdminRoute = window.location.hash.startsWith('#/admin');
      setIsAdmin(onAdminRoute);
      try { setAdminUser(JSON.parse(localStorage.getItem('auth_user') || 'null')); } catch { setAdminUser(null); }
    };
    window.addEventListener('hashchange', check);
    window.addEventListener('authChange', check);
    return () => { window.removeEventListener('hashchange', check); window.removeEventListener('authChange', check); };
  }, []);

  const handleAdminLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.dispatchEvent(new Event('authChange'));
    window.location.hash = '';
    setIsAdmin(false);
    setAdminUser(null);
  };

  // Show admin panel if on #/admin route and user is admin
  if (isAdmin) {
    if (!adminUser) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg-soft gap-4 font-sans">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-8 w-full max-w-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h2 className="text-xl font-bold text-dark mb-1">Admin Access</h2>
            <p className="text-sm text-muted mb-4">Please log in with an admin account to continue.</p>
            <Auth
              open={true}
              onClose={() => {
                try { setAdminUser(JSON.parse(localStorage.getItem('auth_user') || 'null')); } catch { setAdminUser(null); }
              }}
            />
            <button
              onClick={() => { window.location.hash = ''; setIsAdmin(false); }}
              className="mt-4 text-sm text-muted hover:text-dark"
            >
              ← Back to site
            </button>
          </div>
        </div>
      );
    }
    if (adminUser.role !== 'admin') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-soft font-sans">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-8 text-center max-w-sm">
            <p className="text-2xl mb-2">🔒</p>
            <h2 className="font-bold text-dark text-lg mb-2">Access Denied</h2>
            <p className="text-sm text-muted mb-4">Your account does not have admin privileges.</p>
            <button onClick={handleAdminLogout} className="text-sm text-primary underline">Logout & go back</button>
          </div>
        </div>
      );
    }
    return <AdminApp user={adminUser} onLogout={handleAdminLogout} />;
  }

  return (
    <div className="overflow-x-hidden font-sans bg-white selection:bg-primary/10 selection:text-primary">
      <Header />
      <main>
        <Hero />
        <TrustedBy />
        <About />
          <VisaSuccessImages />
        <Destinations />
        <Services />
        <Blogs />
        <Events />
        <PublicCourses />
        <PublicTestimonials />
        <PublicFAQ />
        <Contact />
        <CTABanner />
      </main>
      <footer className="bg-white pt-6 md:pt-24 pb-6 border-t border-border/30">
        <div className="container mx-auto px-4 md:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-0 gap-y-5 md:gap-12 mb-4 md:mb-8">
            {/* Brand Column */}
            <div className="col-span-2 lg:col-span-1 flex flex-col gap-6">
              <img
                src="https://res.cloudinary.com/dtwcgfmar/image/upload/v1777981449/image_20_nseqst.png"
                alt="Ajinorah"
                className="h-14 md:h-16 w-auto self-start"
              />
              <p className="text-[14px] text-muted leading-relaxed max-w-[260px]">
                Empowering students to achieve their global education dreams through fully funded scholarships and expert guidance.
              </p>
              <div className="flex items-center gap-3 mt-4 justify-center md:justify-start pl-2 md:pl-0">
                <a href="https://x.com/Ajinorah_Maha" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center text-muted hover:text-white hover:bg-primary hover:border-primary transition-all">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61586724492187" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center text-muted hover:text-white hover:bg-primary hover:border-primary transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="https://www.instagram.com/ajinorahmaharashtra" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center text-muted hover:text-white hover:bg-primary hover:border-primary transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="https://www.youtube.com/@ajinorahmaharashtra" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center text-muted hover:text-white hover:bg-primary hover:border-primary transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
                <a href="https://www.linkedin.com/in/ajinorah-maharashtra-2316413a7/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center text-muted hover:text-white hover:bg-primary hover:border-primary transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="https://wa.me/919170065003" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center text-muted hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.338 11.897-11.896a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </a>
              </div>
            </div>

            {/* Contact Info & Powered By (Mobile Only) */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-8 md:gap-6">
              <div className="flex flex-col items-start text-left gap-6">
                <div className="flex flex-col gap-1 w-full">
                  <h4 className="text-[13px] font-bold text-dark uppercase tracking-[0.15em]">Get in Touch</h4>
                  <div className="flex flex-col gap-5 mt-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Email Us</span>
                      <a href="mailto:info@ajinorahmaharashtra.com" className="text-[14px] text-dark font-medium hover:text-primary transition-colors break-all">
                        info@ajinorahmaharashtra.com
                      </a>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Call Us</span>
                      <a href="tel:+919170065003" className="text-xs text-dark font-medium hover:text-primary transition-colors">
                        +91 91 7006 5003, <br/>
                        +91 887 2222 887, <br/>
                        +91 86 5150 5150
                      </a>
                    </div>
                  </div>
                </div>

                {/* Powered By (Responsive) — shows on all viewports; stacks on mobile */}
              </div>
            </div>

            {/* Services (Column 3) */}
            <div className="hidden md:flex col-span-1 flex-col gap-6">
              <h4 className="text-[13px] font-bold text-dark uppercase tracking-[0.15em]">Our Services</h4>
              <nav className="flex flex-col gap-4">
                {[
                  "Scholarship Assistance",
                  "IELTS / TOEFL Coaching",
                  "Visa Support",
                  "Abroad Counseling"
                ].map((service) => (
                  <a
                    key={service}
                    href="#services"
                    className="text-[14px] text-muted hover:text-primary transition-colors w-fit"
                  >
                    {service}
                  </a>
                ))}
              </nav>
            </div>

            {/* Quick Links (Column 4) */}
            <div className="col-span-1 flex flex-col items-start gap-6 text-left">
              <h4 className="hidden md:block text-[13px] font-bold text-dark uppercase tracking-[0.15em]">Quick Links</h4>
              <nav className="hidden md:flex flex-col gap-4">
                {["Home", "About Us", "Destinations", "Contact"].map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase().replace(" ", "")}`}
                    className="text-[14px] text-muted hover:text-primary transition-colors w-fit"
                  >
                    {link}
                  </a>
                ))}
              </nav>

              {/* Powered By (Responsive) */}
              
            </div>
          </div>
<div className="flex flex-col md:flex-row items-center gap-2 text-[10px] md:text-[11px] font-bold text-muted uppercase tracking-[0.2em] mt-4 justify-center md:justify-start w-full text-center md:text-left">
                <span>POWERED BY</span>
                <a href="https://www.socialbureau.in/enquiry-form" target="_blank" rel="noopener noreferrer" className="w-full md:w-auto flex justify-center md:justify-start">
                  <img
                    src="https://res.cloudinary.com/dtwcgfmar/image/upload/v1777199141/SB_LOGO_BLACK_PNG_iev5qz.png"
                    alt="SocialBureau"
                    className="h-10 md:h-12 w-auto"
                  />
                </a>
              </div>
          {/* Bottom Bar */}
          <div className="pt-3 md:pt-6 border-t border-border/10 flex items-center justify-start">
            {/* Copyright */}
            <p className="text-xs text-muted font-medium">
              Copyright © {new Date().getFullYear()} Ajinorah Maharashtra. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
