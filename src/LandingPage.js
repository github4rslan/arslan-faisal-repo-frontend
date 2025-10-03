import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AdditionalModules from './AdditionalModules';

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={styles.page}>
      <Helmet>
        <title>DashSphere - Your One-Stop Solution</title>
        <meta name="description" content="Track crypto, weather, and more with DashSphere" />
      </Helmet>

      {/* Animated Background */}
      <div style={styles.bgBlobs}>
        <div style={{...styles.blob, top: 0, left: 0, background: '#a855f7'}}></div>
        <div style={{...styles.blob, top: 0, right: 0, background: '#3b82f6', animationDelay: '2s'}}></div>
        <div style={{...styles.blob, bottom: 0, left: '20%', background: '#ec4899', animationDelay: '4s'}}></div>
      </div>

      {/* Navbar */}
      <nav style={{...styles.nav, ...(scrolled && styles.navScrolled)}}>
        <div style={styles.navInner}>
          <Link to="/" style={styles.logo} onClick={scrollToTop}>
            <div style={styles.logoIcon}>⚡</div>
            <span style={styles.logoText}>DashSphere</span>
          </Link>
          <div style={styles.navLinks}>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.btn}>Get Started</Link>
          </div>
          <button style={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        {menuOpen && (
          <div style={styles.mobileMenu}>
            <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" style={styles.btnMobile} onClick={() => setMenuOpen(false)}>Get Started</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.badge}>✨ New: Advanced Analytics Dashboard</div>
        <h1 style={styles.heroTitle}>Welcome to DashSphere</h1>
        <p style={styles.heroText}>
          Your one-stop solution for tracking crypto, weather, and much more.
          <span style={styles.accent}> Start your journey today!</span>
        </p>
        <div style={styles.heroBtns}>
          <Link to="/register" style={styles.primaryBtn}>
            Get Started Free →
          </Link>
          <Link to="/login" style={styles.secondaryBtn}>Watch Demo</Link>
        </div>
        <div style={styles.stats}>
          <div style={styles.stat}>
            <div style={styles.statNum}>50K+</div>
            <div style={styles.statLabel}>Active Users</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNum}>120+</div>
            <div style={styles.statLabel}>Countries</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNum}>4.9⭐</div>
            <div style={styles.statLabel}>User Rating</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={styles.section}>
        <h2 style={styles.title}>Powerful Features</h2>
        <p style={styles.subtitle}>Everything you need in one place</p>
        <div style={styles.grid}>
          <div style={styles.card} className="card">
            <div style={{...styles.icon, background: 'linear-gradient(135deg, #60a5fa, #06b6d4)'}}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
              </svg>
            </div>
            <h3 style={styles.cardTitle}>Weather Updates</h3>
            <p style={styles.cardText}>Get real-time weather updates and stay informed no matter where you are.</p>
          </div>
          <div style={styles.card} className="card">
            <div style={{...styles.icon, background: 'linear-gradient(135deg, #fb923c, #fbbf24)'}}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"></path>
              </svg>
            </div>
            <h3 style={styles.cardTitle}>Crypto Tracker</h3>
            <p style={styles.cardText}>Track cryptocurrency prices and trends instantly with real-time data.</p>
          </div>
          <div style={styles.card} className="card">
            <div style={{...styles.icon, background: 'linear-gradient(135deg, #a78bfa, #ec4899)'}}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
              </svg>
            </div>
            <h3 style={styles.cardTitle}>Trivia Game</h3>
            <p style={styles.cardText}>Test your knowledge with fun trivia questions and challenges.</p>
          </div>
        </div>
      </section>
      
      <div style={{position: 'relative', zIndex: 1}}>
        <AdditionalModules />
      </div>    

      {/* Testimonials */}
      <section style={styles.section}>
        <h2 style={styles.title}>Loved by Users Worldwide</h2>
        <div style={styles.testimonial}>
          <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
          <p style={styles.quote}>"DashSphere is amazing! It helps me keep track of everything I need."</p>
          <div style={styles.author}>
            <div style={styles.authorName}>Jane Doe</div>
            <div style={styles.authorRole}>Product Manager</div>
          </div>
          
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
        <p style={styles.ctaText}>Join thousands of users who trust DashSphere for their daily needs.</p>
        <Link to="/register" style={styles.ctaBtn}>Start Free Trial</Link>
        <p style={styles.ctaNote}>No credit card required • 14-day free trial</p>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <Link to="/" style={styles.footerLogo} onClick={scrollToTop}>
            <span style={styles.logoIcon}>⚡</span>
            <span>DashSphere</span>
          </Link>
          <div style={styles.footerLinks}>
            <Link to="/" style={styles.footerLink} onClick={scrollToTop}>Home</Link>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" style={styles.footerLink}>Twitter</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={styles.footerLink}>Facebook</a>
          </div>
          <p style={styles.copyright}>&copy; 2025 DashSphere. All Rights Reserved.</p>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .card { transition: all 0.3s ease; }
        .card:hover { transform: translateY(-8px); background: rgba(255,255,255,0.1) !important; }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
        }
        @media (min-width: 769px) {
          .menu-btn { display: none !important; }
        }
      `}</style>
      
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)', color: '#fff', position: 'relative', overflow: 'hidden' },
  bgBlobs: { position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 },
  blob: { position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.2, animation: 'blob 7s infinite' },
  nav: { position: 'fixed', top: 0, width: '100%', zIndex: 50, transition: 'all 0.3s', background: 'transparent' },
  navScrolled: { background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  navInner: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' },
  logo: { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', cursor: 'pointer' },
  logoIcon: { width: '36px', height: '36px', background: 'linear-gradient(135deg, #a855f7, #3b82f6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  logoText: { fontSize: '22px', fontWeight: 'bold', background: 'linear-gradient(135deg, #c084fc, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '30px' },
  link: { color: '#d1d5db', textDecoration: 'none', fontSize: '16px' },
  btn: { padding: '8px 20px', background: 'linear-gradient(135deg, #a855f7, #3b82f6)', color: '#fff', borderRadius: '20px', textDecoration: 'none', fontWeight: '600' },
  menuBtn: { display: 'none', background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' },
  mobileMenu: { background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' },
  mobileLink: { color: '#d1d5db', textDecoration: 'none', padding: '8px 0' },
  btnMobile: { padding: '10px 20px', background: 'linear-gradient(135deg, #a855f7, #3b82f6)', color: '#fff', borderRadius: '20px', textDecoration: 'none', textAlign: 'center', fontWeight: '600' },
  hero: { position: 'relative', padding: '140px 20px 60px', textAlign: 'center', zIndex: 1 },
  badge: { display: 'inline-block', padding: '8px 16px', background: 'rgba(168, 85, 247, 0.2)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '20px', color: '#d8b4fe', fontSize: '14px', marginBottom: '20px' },
  heroTitle: { fontSize: 'clamp(36px, 8vw, 60px)', fontWeight: 'bold', marginBottom: '20px', background: 'linear-gradient(135deg, #fff, #d8b4fe, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 },
  heroText: { fontSize: 'clamp(18px, 3vw, 22px)', color: '#d1d5db', marginBottom: '30px', maxWidth: '700px', margin: '0 auto 30px' },
  accent: { display: 'block', color: '#c084fc', marginTop: '8px' },
  heroBtns: { display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', marginBottom: '40px' },
  primaryBtn: { padding: '14px 28px', background: 'linear-gradient(135deg, #a855f7, #3b82f6)', color: '#fff', borderRadius: '25px', textDecoration: 'none', fontWeight: '600', fontSize: '16px' },
  secondaryBtn: { padding: '14px 28px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', borderRadius: '25px', textDecoration: 'none', fontWeight: '600', fontSize: '16px' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', maxWidth: '700px', margin: '0 auto' },
  stat: { background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '15px', padding: '20px' },
  statNum: { fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' },
  statLabel: { color: '#9ca3af', fontSize: '14px' },
  section: { padding: '60px 20px', position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' },
  title: { fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 'bold', textAlign: 'center', marginBottom: '15px' },
  subtitle: { fontSize: '18px', color: '#9ca3af', textAlign: 'center', marginBottom: '50px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' },
  card: { background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '30px' },
  icon: { display: 'inline-block', padding: '12px', borderRadius: '12px', marginBottom: '20px' },
  cardTitle: { fontSize: '22px', fontWeight: 'bold', marginBottom: '12px' },
  cardText: { color: '#9ca3af', lineHeight: 1.6 },
  testimonial: { maxWidth: '700px', margin: '50px auto', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '40px', textAlign: 'center' },
  stars: { fontSize: '24px', marginBottom: '20px' },
  quote: { fontSize: '20px', color: '#d1d5db', fontStyle: 'italic', marginBottom: '25px', lineHeight: 1.6 },
  author: { marginTop: '20px' },
  authorName: { fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' },
  authorRole: { color: '#c084fc', fontSize: '14px' },
  cta: { padding: '60px 20px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2))', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', maxWidth: '800px', margin: '40px auto', position: 'relative', zIndex: 1 },
  ctaTitle: { fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 'bold', marginBottom: '15px' },
  ctaText: { fontSize: '18px', color: '#d1d5db', marginBottom: '30px' },
  ctaBtn: { display: 'inline-block', padding: '16px 36px', background: 'linear-gradient(135deg, #a855f7, #3b82f6)', color: '#fff', fontSize: '18px', borderRadius: '25px', textDecoration: 'none', fontWeight: '600' },
  ctaNote: { marginTop: '15px', color: '#9ca3af', fontSize: '14px' },
  footer: { background: 'rgba(15, 23, 42, 0.5)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '40px 20px', position: 'relative', zIndex: 1 },
  footerContent: { maxWidth: '1200px', margin: '0 auto', textAlign: 'center' },
  footerLogo: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none', color: '#fff' },
  footerLinks: { display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' },
  footerLink: { color: '#9ca3af', textDecoration: 'none', fontSize: '14px' },
  copyright: { color: '#9ca3af', fontSize: '14px', margin: 0 },
};

export default LandingPage;