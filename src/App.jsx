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
  return (
    <header className="hdr">
      <div className="container hdr-inner">
        <a href="/" className="brand">
          <img src="https://res.cloudinary.com/dtwcgfmar/image/upload/v1777722355/ajinorah_fjyuxs.webp" alt="Ajinorah" className="brand-logo" />
          
        </a>

        <nav className={`main-nav ${open ? "open" : ""}`}>
          <a href="/" className="nav-link active">Home</a>
          <a href="about" className="nav-link">About Us</a>
          <a href="services" className="nav-link dropdown-trigger">Services <ChevDownIcon /></a>
          <a href="destinations" className="nav-link dropdown-trigger">Countries <ChevDownIcon /></a>
          <a href="universities" className="nav-link">Universities</a>
          <a href="contact" className="nav-link">Contact Us</a>
        </nav>

        <div className="hdr-right">
          <button className="btn btn-primary btn-sm">
            Book Free Consultation <ArrowRightIcon />
          </button>
          <button className="hamburger" onClick={() => setOpen(!open)}><MenuIcon /></button>
        </div>
      </div>
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        {/* Left Content */}
        <div className="hero-content">
          <p className="eyebrow">
            <span className="eyebrow-dot" />
            YOUR TRUSTED EDUCATION PARTNER
          </p>
          <h1 className="hero-heading">
            Your Dream.<br />
            Our Guidance.<br />
            <span className="gradient-text">Global Success.</span>
          </h1>
          <p className="hero-desc">
            We help ambitious students gain admission to<br />
            top universities worldwide and build a brighter future.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary">
              Book Free Consultation <ArrowRightIcon />
            </button>
            <button className="btn btn-outline">
              Explore Destinations <ArrowRightIcon />
            </button>
          </div>

          <div className="hero-features">
            {[
              { icon: FeatureIcons.guidance, label: "Personalized\nGuidance" },
              { icon: FeatureIcons.support, label: "End-to-End\nSupport" },
              { icon: FeatureIcons.university, label: "University\nShortlisting" },
              { icon: FeatureIcons.visa, label: "Visa & Travel\nAssistance" },
            ].map((f) => (
              <div key={f.label} className="feature-item">
                <div className="feature-icon">{f.icon}</div>
                <span className="feature-label">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Visual */}
        <div className="hero-visual">
          <div className="hero-img-wrap">
            <div className="hero-circle-bg" />
            <img
              src="https://res.cloudinary.com/dtwcgfmar/image/upload/v1777724841/Untitled_design_58_gtqso7.png"
              alt="Student studying abroad"
              className="hero-img"
            />
            <div className="video-card">
              <div className="video-play"><PlayIcon /></div>
              <div className="video-info">
                <span className="video-title">Watch Our Story</span>
                <span className="video-time">2:45 Min</span>
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
    { abbr: "MIT", name: "Massachusetts\nInstitute of\nTechnology" },
    { abbr: "S", name: "Stanford\nUniversity", wordmark: true },
    { abbr: null, name: "THE UNIVERSITY OF\nMELBOURNE" },
    { abbr: "NUS", name: "National University\nof Singapore" },
    { abbr: null, name: "KING'S\nCOLLEGE\nLONDON" },
    { abbr: null, name: "THE UNIVERSITY OF\nBRITISH COLUMBIA" },
  ];
  return (
    <section className="trusted-section">
      <div className="container">
        <p className="trusted-label">TRUSTED BY 500+ LEADING UNIVERSITIES WORLDWIDE</p>
        <div className="uni-logos">
          {unis.map((u, i) => (
            <div key={i} className="uni-logo">
              {u.abbr && <span className="uni-abbr">{u.abbr}</span>}
              <span className="uni-name">{u.name}</span>
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
      name: "United States",
      flag: "🇺🇸",
      desc: "Top universities, diverse courses & global exposure.",
      img: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=220&fit=crop&q=80",
    },
    {
      name: "United Kingdom",
      flag: "🇬🇧",
      desc: "World-class education with rich culture & history.",
      img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=220&fit=crop&q=80",
    },
    {
      name: "Canada",
      flag: "🇨🇦",
      desc: "Affordable education & great post-study options.",
      img: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=220&fit=crop&q=80",
    },
    {
      name: "Australia",
      flag: "🇦🇺",
      desc: "High-quality education & relaxed lifestyle.",
      img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=220&fit=crop&q=80",
    },
  ];

  return (
    <section id="destinations" className="section destinations-section">
      <div className="container destinations-inner">
        <div className="section-left">
          <p className="section-tag">POPULAR DESTINATIONS</p>
          <h2 className="section-heading">Explore Top Study<br />Abroad Destinations</h2>
          <p className="section-desc">
            Choose from the world's best countries<br />and top-ranked universities.
          </p>
          <a href="#" className="link-arrow">View All Countries <ArrowRightIcon /></a>
        </div>

        <div className="dest-cards-wrap">
          <div className="dest-cards">
            {countries.map((c) => (
              <div key={c.name} className="dest-card">
                <div className="dest-card-img">
                  <img src={c.img} alt={c.name} />
                </div>
                <div className="dest-card-body">
                  <div className="dest-card-title">
                    <span className="dest-name">{c.name}</span>
                  </div>
                  <p className="dest-desc">{c.desc}</p>
                  <button className="dest-arrow-btn"><ArrowRightIcon size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="dest-nav">
            <button className="dest-nav-btn">‹</button>
            <button className="dest-nav-btn">›</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Services ────────────────────────────────────────────── */
function Services() {
  const services = [
    { key: "career", icon: ServiceSVGs.career, color: "#FFF3EC", stroke: "#FF6B35", title: "Career Counseling", desc: "Personalized guidance to help you choose the right path." },
    { key: "university", icon: ServiceSVGs.university, color: "#FFFBEB", stroke: "#F59E0B", title: "University Selection", desc: "We help you find the best universities that match your goals." },
    { key: "application", icon: ServiceSVGs.application, color: "#F0FDF4", stroke: "#22C55E", title: "Application Support", desc: "Expert assistance for flawless and standout applications." },
    { key: "visa", icon: ServiceSVGs.visa, color: "#EFF6FF", stroke: "#3B82F6", title: "Visa Assistance", desc: "End-to-end visa support to increase your success rate." },
    { key: "arrival", icon: ServiceSVGs.arrival, color: "#F5F3FF", stroke: "#8B5CF6", title: "Post Arrival Support", desc: "We assist you after you land — because your journey continues." },
  ];

  return (
    <section id="services" className="section services-section">
      <div className="container services-inner">
        <div className="section-left">
          <p className="section-tag">OUR SERVICES</p>
          <h2 className="section-heading">We're with you<br />at every step</h2>
          <div className="heading-underline" />
          <p className="section-desc">
            From shortlisting to visa approval and<br />
            beyond — we make your study abroad<br />
            journey smooth and successful.
          </p>
          <a href="#" className="link-arrow">View All Services <ArrowRightIcon /></a>
        </div>

        <div className="service-cards">
          {services.map((s) => (
            <div key={s.key} className="service-card">
              <div className="service-icon-wrap" style={{ background: s.color, color: s.stroke }}>
                {s.icon}
              </div>
              <div className="service-card-body">
                <h4 className="service-title">{s.title}</h4>
                <p className="service-desc">{s.desc}</p>
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
    <section className="cta-section">
      <div className="container cta-inner">
        <div className="cta-text">
          <h2 className="cta-heading">
            Ready to Start Your<br />
            <span className="gradient-text-orange">Study Abroad</span> Journey?
          </h2>
          <p className="cta-desc">
            Book your free consultation today and take<br />
            the first step towards your global future.
          </p>
          <button className="btn btn-primary cta-btn">
            Book Free Consultation <ArrowRightIcon />
          </button>
        </div>
        <div className="cta-illustration">
          <img src="https://res.cloudinary.com/dtwcgfmar/image/upload/v1777735386/Untitled_design_60_zcftlx.png" alt="Ajinorah"/>
        </div>
      </div>
    </section>
  );
}

/* ── App ─────────────────────────────────────────────────── */
export default function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <TrustedBy />
        <Destinations />
        <Services />
        <CTABanner />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <img src="https://res.cloudinary.com/dtwcgfmar/image/upload/v1777722355/ajinorah_fjyuxs.webp" alt="Ajinorah" className="brand-logo" />
            
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} Ajinorah. All rights reserved.</p>
          <p>POWERED BY <img src="https://www.socialbureau.in/assets/socialbureau.png" alt="SocialBureau" className="brand-logo" /></p>
        </div>
      </footer>
    </div>
  );
}
