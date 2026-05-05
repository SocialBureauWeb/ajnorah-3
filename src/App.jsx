import React, { useState } from "react";

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
  career: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
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

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About Us", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Destinations", href: "#destinations" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-border/40 h-[100px] flex items-center overflow-visible">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between w-full h-full">
        {/* Brand */}
        <div className="flex items-center shrink-0 w-[200px] md:w-[450px] h-full relative">
          <a href="#home" className="block absolute top-[40%] -translate-y-1/2 left-0 z-50">
            <img
              src="https://res.cloudinary.com/dtwcgfmar/image/upload/v1777557258/images/osrzkwmrt33dlpzyofze.png"
              alt="Ajinorah"
              className="h-[200px] md:h-[400px] w-auto block transition-all hover:scale-105 object-contain object-left drop-shadow-2xl"
            />
          </a>
        </div>

        {/* Navigation */}
        <nav className={`
          ${open ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-4 opacity-0 pointer-events-none"} 
          flex md:flex md:translate-y-0 md:opacity-100 md:pointer-events-auto 
          absolute md:static left-0 right-0 top-[100px] bg-white md:bg-transparent 
          p-4 md:p-0 flex-col md:flex-row items-stretch md:items-center gap-0 md:gap-1 md:ml-16 md:mr-auto z-50 
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
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 ml-4">
          <a
            href="https://wa.me/919170065003"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-white px-7 py-3 rounded-full font-bold text-[13.5px] shadow-[0_10px_25px_-5px_rgba(107,71,220,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(107,71,220,0.4)] hover:-translate-y-0.5 transition-all hidden md:inline-flex items-center gap-2"
          >
            Enquire Now <ArrowRightIcon size={16} />
          </a>
          <button
            className="p-2.5 rounded-xl md:hidden transition-all text-black border border-border/50 hover:bg-bg-soft"
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

          <div className="flex gap-6 flex-wrap pt-6 border-t border-border/50">
            {[
              { icon: FeatureIcons.guidance, label: "100% Scholarship\nFocus" },
              { icon: FeatureIcons.support, label: "End-to-End\nSupport" },
              { icon: FeatureIcons.university, label: "Global Partner\nNetwork" },
              { icon: FeatureIcons.visa, label: "95% Visa\nSuccess Rate" },
            ].map((f) => (
              <div key={f.label} className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-bg-soft border border-border/50 flex items-center justify-center shrink-0 text-primary">{f.icon}</div>
                <span className="text-[11.5px] font-semibold text-dark whitespace-pre-line leading-tight">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Visual */}
        <div className="flex justify-start md:justify-center items-center h-[400px] md:h-[500px] relative z-10">
          <div className="relative w-full max-w-[850px] h-full flex items-center justify-start md:justify-center">

            <img
              src="https://res.cloudinary.com/dtwcgfmar/image/upload/v1777724841/Untitled_design_58_gtqso7.png"
              alt="Student"
              className="absolute top-1/2 left-0 md:left-1/2 -translate-x-24 md:-translate-x-1/2 -translate-y-1/2 w-full h-full object-contain z-10 scale-125"
            />
            <div className="absolute bottom-[85px] md:bottom-[40px] right-6 md:-right-[10px] bg-white rounded-2xl shadow-lg p-2.5 md:p-4 flex items-center gap-3 z-20 min-w-[140px] md:min-w-[210px] border border-border/50">
              <div className="shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary scale-75 md:scale-100"><PlayIcon /></div>
              <div className="flex flex-col gap-0">
                <span className="text-[11px] md:text-[14.5px] font-bold text-dark">Join 1 Lakh+ Students</span>
                <span className="text-[9px] md:text-[12px] text-muted">Global Network</span>
              </div>
            </div>
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
  ];
  return (
    <section className="py-12 border-y border-border bg-[#FAFBFF]">
      <div className="container">
        <p className="text-center text-[11.5px] font-bold tracking-[0.12em] text-muted uppercase mb-7">OUR GLOBAL PARTNER NETWORK ACROSS 7+ COUNTRIES</p>
        <div className="flex items-center justify-center gap-9 flex-wrap">
          {unis.map((u, i) => (
            <div key={i} className="flex items-center gap-2 opacity-60 transition-opacity hover:opacity-90">
              {u.abbr && <span className="text-[22px] font-black text-dark tracking-tighter leading-none">{u.abbr}</span>}
              <span className="text-[9.5px] font-bold text-dark uppercase tracking-[0.04em] whitespace-pre-line leading-tight">{u.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Destinations ────────────────────────────────────────── */
function Destinations() {
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
  ];

  return (
    <section id="destinations" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-[280px_1fr] items-start gap-12">
        <div className="text-center md:text-left">
          <p className="text-[11px] font-bold tracking-[0.14em] text-teal uppercase mb-3.5">POPULAR DESTINATIONS</p>
          <h2 className="text-4xl font-extrabold text-dark leading-snug mb-4 tracking-tight">Explore Top Study<br />Abroad Destinations</h2>
          <p className="text-[14.5px] text-muted leading-relaxed mb-6">
            Choose from the world's best countries<br />and top-ranked universities.
          </p>
          <a href="#" className="inline-flex items-center gap-[7px] text-sm font-semibold text-primary transition-all hover:gap-[11px] justify-center md:justify-start">View All Countries <ArrowRightIcon /></a>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {countries.map((c) => (
              <div key={c.name} className="bg-white rounded-xl shadow-sm overflow-hidden border border-border transition-all hover:-translate-y-1 hover:shadow-md group">
                <div className="h-[140px] overflow-hidden">
                  <img src={c.img} alt={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-3.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[13.5px] font-bold text-dark">{c.name}</span>
                  </div>
                  <p className="text-[12px] text-muted leading-relaxed mb-2.5">{c.desc}</p>
                  <button className="w-7 h-7 rounded-full bg-bg-soft border border-border flex items-center justify-center text-primary text-[13px] transition-colors hover:bg-primary hover:text-white hover:border-primary"><ArrowRightIcon size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <button className="w-9 h-9 rounded-full bg-white border-[1.5px] border-border text-xl flex items-center justify-center transition-all hover:bg-primary hover:text-white hover:border-primary">‹</button>
            <button className="w-9 h-9 rounded-full bg-white border-[1.5px] border-border text-xl flex items-center justify-center transition-all hover:bg-primary hover:text-white hover:border-primary">›</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Services ────────────────────────────────────────────── */
function Services() {
  const services = [
    { key: "scholarship", icon: ServiceSVGs.career, color: "#FFF3EC", stroke: "#FF6B35", title: "Scholarship Assistance", desc: "Specializing in 100% funded and sponsored opportunities." },
    { key: "coaching", icon: ServiceSVGs.university, color: "#FFFBEB", stroke: "#F59E0B", title: "IELTS / TOEFL Coaching", desc: "Expert training to ace your language proficiency tests." },
    { key: "counseling", icon: ServiceSVGs.application, color: "#F0FDF4", stroke: "#22C55E", title: "Abroad Study Counseling", desc: "End-to-end guidance from selection to pre-departure." },
    { key: "visa", icon: ServiceSVGs.visa, color: "#EFF6FF", stroke: "#3B82F6", title: "Visa Processing Support", desc: "High success rate with personalized visa assistance." },
    { key: "corporate", icon: ServiceSVGs.arrival, color: "#F5F3FF", stroke: "#8B5CF6", title: "Corporate Training", desc: "Upskilling programs for professionals and students alike." },
  ];

  return (
    <section id="services" className="py-20 bg-bg-soft">
      <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-[280px_1fr] items-start gap-12">
        <div className="text-center md:text-left">
          <p className="text-[11px] font-bold tracking-[0.14em] text-teal uppercase mb-3.5">OUR SERVICES</p>
          <h2 className="text-4xl font-extrabold text-dark leading-snug mb-4 tracking-tight">We're with you<br />at every step</h2>
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
            <div key={s.key} className="bg-white rounded-xl p-[18px_20px] flex items-start gap-4 shadow-sm border border-border transition-all hover:shadow-md hover:translate-x-1">
              <div className="w-[50px] h-[50px] rounded-xl flex items-center justify-center shrink-0" style={{ background: s.color, color: s.stroke }}>
                {s.icon}
              </div>
              <div>
                <h4 className="text-[14.5px] font-bold text-dark mb-1">{s.title}</h4>
                <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
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
          <a href="https://wa.me/919170065003" target="_blank" rel="noopener noreferrer" className="bg-primary text-white px-8 py-3.5 rounded-full font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all inline-flex items-center gap-2">
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
    <section id="about" className="py-20">
      <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-16 items-center">
        <div className="text-center md:text-left">
          <p className="text-[11px] font-bold tracking-[0.14em] text-teal uppercase mb-3.5">WHO WE ARE</p>
          <h2 className="text-4xl font-extrabold text-dark leading-snug mb-4 tracking-tight">Your Gateway to<br />Global Education</h2>
          <div className="w-10 h-[3px] bg-orange rounded-sm mb-[18px] mx-auto md:mx-0" />
          <p className="text-[14.5px] text-muted leading-relaxed mb-6">
            Ajinorah Maharashtra is a global education consultancy dedicated to helping students access high-quality international education through <strong>fully funded and sponsored opportunities</strong>.
          </p>
        </div>
        <div className="flex flex-col gap-8">
          <p className="text-muted leading-relaxed text-center md:text-left">
            Our core mission is to make studying abroad affordable and accessible by connecting students with 100% scholarship programs, sponsorships, and budget-friendly study pathways across multiple countries.
          </p>
          <div className="grid grid-cols-3 gap-4 md:gap-6 mt-4">
            <div className="bg-white p-4 md:p-6 rounded-xl border border-border text-center transition-transform hover:-translate-y-1 shadow-sm">
              <span className="block text-2xl font-extrabold text-primary mb-1">95%</span>
              <span className="text-[10px] md:text-xs font-semibold text-muted uppercase">Visa Success</span>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl border border-border text-center transition-transform hover:-translate-y-1 shadow-sm">
              <span className="block text-2xl font-extrabold text-primary mb-1">100k+</span>
              <span className="text-[10px] md:text-xs font-semibold text-muted uppercase">Students Guided</span>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl border border-border text-center transition-transform hover:-translate-y-1 shadow-sm">
              <span className="block text-2xl font-extrabold text-primary mb-1">500+</span>
              <span className="text-[10px] md:text-xs font-semibold text-muted uppercase">Partner Unis</span>
            </div>
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const phone = "919170065003";
    const text = `*New Enquiry from Website*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Destination:* ${formData.destination}%0A*Message:* ${formData.message}`;
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
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
              <a href="mailto:info@ajinorahmaharashtra.com" className="text-base text-dark font-medium hover:text-primary transition-colors">info@ajinorahmaharashtra.com</a>
            </div>
            <div className="flex flex-col gap-1">
              <strong className="text-xs text-primary uppercase tracking-wider font-bold">Phone:</strong>
              <a href="tel:+919170065003" className="text-base text-dark font-medium hover:text-primary transition-colors">+91 91 7006 5003</a>
            </div>
            <div className="flex flex-col gap-1">
              <strong className="text-xs text-primary uppercase tracking-wider font-bold">Service Address:</strong>
              <p className="text-base text-dark font-medium">102, Deo Enclave, Vile Parle East, Mumbai - 400057</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-[24px] shadow-lg border border-border/50">
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
            <button type="submit" className="bg-primary text-white w-full py-4 rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">Send to WhatsApp</button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ── App ─────────────────────────────────────────────────── */
export default function App() {
  return (
    <div className="overflow-x-hidden font-sans bg-white selection:bg-primary/10 selection:text-primary">
      <Header />
      <main>
        <Hero />
        <TrustedBy />
        <About />
        <Destinations />
        <Services />
        <Contact />
        <CTABanner />
      </main>
      <footer className="bg-white pt-4 md:pt-24 pb-12 border-t border-border/30">
        <div className="container mx-auto px-4 md:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-0 gap-y-12 md:gap-12 mb-8">
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
            </div>

            {/* Quick Links */}
            <div className="col-span-1 flex flex-col gap-6">
              <h4 className="text-[13px] font-bold text-dark uppercase tracking-[0.15em]">Quick Links</h4>
              <nav className="flex flex-col gap-4">
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
            </div>

            {/* Services */}
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

            {/* Contact Info */}
            <div className="col-span-1 flex flex-col gap-6 -ml-6 md:ml-0">
              <h4 className="text-[13px] font-bold text-dark uppercase tracking-[0.15em]">Get in Touch</h4>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Email Us</span>
                  <a href="mailto:info@ajinorahmaharashtra.com" className="text-[14px] text-dark font-medium hover:text-primary transition-colors">
                    info@ajinorahmaharashtra.com
                  </a>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Call Us</span>
                  <a href="tel:+919170065003" className="text-[14px] text-dark font-medium hover:text-primary transition-colors">
                    +91 91 7006 5003
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            {/* Copyright */}
            <p className="text-sm text-muted font-medium order-2 md:order-1">
              © {new Date().getFullYear()} Ajinorah Maharashtra. All rights reserved.
            </p>

            {/* Powered By */}
            <div className="flex flex-col md:flex-row items-center gap-1 text-[12px] md:text-[13px] font-bold text-muted uppercase tracking-[0.2em] order-1 md:order-2">
              <span>POWERED BY</span>
              <img
                src="https://res.cloudinary.com/dtwcgfmar/image/upload/v1777199141/SB_LOGO_BLACK_PNG_iev5qz.png"
                alt="SocialBureau"
                className="h-16 md:h-24 w-auto scale-110"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
