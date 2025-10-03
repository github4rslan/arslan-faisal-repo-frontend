import React, { useState } from 'react';

const AdditionalModules = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const faqs = [
    {
      question: "How does DashSphere work?",
      answer: "DashSphere aggregates data from multiple sources to provide you with real-time updates on weather, cryptocurrency prices, and interactive trivia games all in one unified dashboard."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. You can cancel your subscription at any time from your account settings. No questions asked, no cancellation fees."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and cryptocurrency payments including Bitcoin and Ethereum."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact our support team for a full refund."
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      period: "Forever",
      features: [
        "Basic weather updates",
        "Limited crypto tracking (5 coins)",
        "10 trivia questions/day",
        "Community support",
        "Mobile app access"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      features: [
        "Advanced weather forecasts",
        "Unlimited crypto tracking",
        "Unlimited trivia games",
        "Priority support",
        "Custom alerts & notifications",
        "API access",
        "Ad-free experience"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$29.99",
      period: "/month",
      features: [
        "Everything in Pro",
        "Team collaboration (up to 10 users)",
        "Advanced analytics & reports",
        "White-label solution",
        "Dedicated account manager",
        "Custom integrations",
        "99.9% uptime SLA"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const partners = [
    { name: "CoinGecko", logo: "🦎" },
    { name: "OpenWeather", logo: "🌤️" },
    { name: "TriviaDB", logo: "🎯" },
    { name: "CloudFlare", logo: "☁️" },
    { name: "Stripe", logo: "💳" },
    { name: "AWS", logo: "☁️" }
  ];

  const team = [
    { name: "Sarah Johnson", role: "CEO & Founder", avatar: "👩‍💼" },
    { name: "Mike Chen", role: "CTO", avatar: "👨‍💻" },
    { name: "Emma Davis", role: "Head of Design", avatar: "👩‍🎨" },
    { name: "James Wilson", role: "Lead Developer", avatar: "👨‍🔬" }
  ];

  return (
    <div style={styles.container}>
      {/* Pricing Section */}
      <section style={styles.section} id="pricing">
        <div style={styles.sectionHeader}>
          <div style={styles.badge}>💎 Pricing Plans</div>
          <h2 style={styles.title}>Choose Your Perfect Plan</h2>
          <p style={styles.subtitle}>Flexible pricing for teams of all sizes</p>
        </div>
        
        <div style={styles.pricingGrid}>
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              style={{
                ...styles.pricingCard,
                ...(plan.popular && styles.popularCard)
              }}
              className="pricing-card"
            >
              {plan.popular && (
                <div style={styles.popularBadge}>⭐ Most Popular</div>
              )}
              <h3 style={styles.planName}>{plan.name}</h3>
              <div style={styles.priceContainer}>
                <span style={styles.price}>{plan.price}</span>
                <span style={styles.period}>{plan.period}</span>
              </div>
              <ul style={styles.featureList}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={styles.feature}>
                    <span style={styles.checkmark}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button style={{
                ...styles.planBtn,
                ...(plan.popular && styles.popularBtn)
              }}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section style={styles.section}>
        <h2 style={styles.title}>Feature Comparison</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Feature</th>
                <th style={styles.th}>Starter</th>
                <th style={styles.th}>Pro</th>
                <th style={styles.th}>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr style={styles.tableRow}>
                <td style={styles.td}>Weather Updates</td>
                <td style={styles.td}>Basic</td>
                <td style={styles.td}>Advanced</td>
                <td style={styles.td}>Advanced</td>
              </tr>
              <tr style={styles.tableRow}>
                <td style={styles.td}>Crypto Tracking</td>
                <td style={styles.td}>5 coins</td>
                <td style={styles.td}>Unlimited</td>
                <td style={styles.td}>Unlimited</td>
              </tr>
              <tr style={styles.tableRow}>
                <td style={styles.td}>API Access</td>
                <td style={styles.td}>✗</td>
                <td style={styles.td}>✓</td>
                <td style={styles.td}>✓</td>
              </tr>
              <tr style={styles.tableRow}>
                <td style={styles.td}>Team Collaboration</td>
                <td style={styles.td}>✗</td>
                <td style={styles.td}>✗</td>
                <td style={styles.td}>Up to 10 users</td>
              </tr>
              <tr style={styles.tableRow}>
                <td style={styles.td}>Support</td>
                <td style={styles.td}>Community</td>
                <td style={styles.td}>Priority</td>
                <td style={styles.td}>Dedicated</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={styles.section} id="faq">
        <h2 style={styles.title}>Frequently Asked Questions</h2>
        <p style={styles.subtitle}>Everything you need to know about DashSphere</p>
        
        <div style={styles.faqContainer}>
          {faqs.map((faq, index) => (
            <div key={index} style={styles.faqItem} className="faq-item">
              <button 
                style={styles.faqQuestion}
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                <span style={{
                  ...styles.faqIcon,
                  transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                  ▼
                </span>
              </button>
              {openFaq === index && (
                <div style={styles.faqAnswer}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section style={styles.section}>
        <h2 style={styles.title}>Meet Our Team</h2>
        <p style={styles.subtitle}>The brilliant minds behind DashSphere</p>
        
        <div style={styles.teamGrid}>
          {team.map((member, index) => (
            <div key={index} style={styles.teamCard} className="team-card">
              <div style={styles.avatar}>{member.avatar}</div>
              <h3 style={styles.memberName}>{member.name}</h3>
              <p style={styles.memberRole}>{member.role}</p>
              <div style={styles.socialLinks}>
                <span style={styles.socialIcon}>🐦</span>
                <span style={styles.socialIcon}>💼</span>
                <span style={styles.socialIcon}>📧</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners Section */}
      <section style={styles.section}>
        <h2 style={styles.title}>Trusted By Industry Leaders</h2>
        <div style={styles.partnersGrid}>
          {partners.map((partner, index) => (
            <div key={index} style={styles.partnerCard} className="partner-card">
              <div style={styles.partnerLogo}>{partner.logo}</div>
              <div style={styles.partnerName}>{partner.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={styles.newsletterSection}>
        <div style={styles.newsletterCard}>
          <h2 style={styles.newsletterTitle}>Stay Updated</h2>
          <p style={styles.newsletterText}>
            Subscribe to our newsletter for the latest updates, features, and exclusive offers.
          </p>
          
          {subscribed ? (
            <div style={styles.successMessage}>
              ✓ Thank you for subscribing! Check your email for confirmation.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.emailInput}
                required
              />
              <button type="submit" style={styles.subscribeBtn}>
                Subscribe →
              </button>
            </form>
          )}
          
          <p style={styles.privacyNote}>
            🔒 We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      <style>{`
        .pricing-card {
          transition: all 0.3s ease;
        }
        .pricing-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(168, 85, 247, 0.3);
        }
        .faq-item {
          transition: all 0.3s ease;
        }
        .faq-item:hover {
          background: rgba(255, 255, 255, 0.08) !important;
        }
        .team-card {
          transition: all 0.3s ease;
        }
        .team-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.08) !important;
        }
        .partner-card {
          transition: all 0.3s ease;
        }
        .partner-card:hover {
          transform: scale(1.05);
          background: rgba(255, 255, 255, 0.08) !important;
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
    color: '#fff',
    padding: '40px 20px'
  },
  section: {
    maxWidth: '1200px',
    margin: '0 auto 80px',
    position: 'relative'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '50px'
  },
  badge: {
    display: 'inline-block',
    padding: '8px 16px',
    background: 'rgba(168, 85, 247, 0.2)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '20px',
    color: '#d8b4fe',
    fontSize: '14px',
    marginBottom: '15px'
  },
  title: {
    fontSize: 'clamp(32px, 5vw, 44px)',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '15px',
    background: 'linear-gradient(135deg, #fff, #d8b4fe)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '18px',
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: '40px'
  },
  
  // Pricing Styles
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    padding: '20px 0'
  },
  pricingCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '35px',
    position: 'relative'
  },
  popularCard: {
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(59, 130, 246, 0.15))',
    border: '2px solid rgba(168, 85, 247, 0.5)',
    transform: 'scale(1.05)'
  },
  popularBadge: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 'bold'
  },
  planName: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  priceContainer: {
    marginBottom: '25px'
  },
  price: {
    fontSize: '40px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #c084fc, #60a5fa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  period: {
    fontSize: '16px',
    color: '#9ca3af',
    marginLeft: '5px'
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '30px'
  },
  feature: {
    padding: '12px 0',
    color: '#d1d5db',
    fontSize: '15px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  checkmark: {
    color: '#10b981',
    marginRight: '10px',
    fontWeight: 'bold'
  },
  planBtn: {
    width: '100%',
    padding: '14px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  popularBtn: {
    background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
    border: 'none'
  },
  
  // Table Styles
  tableContainer: {
    overflowX: 'auto',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    padding: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    borderBottom: '2px solid rgba(168, 85, 247, 0.3)'
  },
  th: {
    padding: '15px',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  tableRow: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  td: {
    padding: '15px',
    color: '#d1d5db'
  },
  
  // FAQ Styles
  faqContainer: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  faqItem: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    marginBottom: '15px',
    overflow: 'hidden'
  },
  faqQuestion: {
    width: '100%',
    padding: '20px',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '18px',
    fontWeight: '600',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  faqIcon: {
    fontSize: '14px',
    transition: 'transform 0.3s ease',
    color: '#a855f7'
  },
  faqAnswer: {
    padding: '0 20px 20px',
    color: '#d1d5db',
    lineHeight: 1.7,
    fontSize: '16px'
  },
  
  // Team Styles
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px'
  },
  teamCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    padding: '30px',
    textAlign: 'center'
  },
  avatar: {
    width: '80px',
    height: '80px',
    margin: '0 auto 20px',
    background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px'
  },
  memberName: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  memberRole: {
    color: '#c084fc',
    marginBottom: '15px',
    fontSize: '14px'
  },
  socialLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    fontSize: '20px'
  },
  socialIcon: {
    cursor: 'pointer',
    opacity: 0.7,
    transition: 'opacity 0.3s'
  },
  
  // Partners Styles
  partnersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px'
  },
  partnerCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '25px',
    textAlign: 'center'
  },
  partnerLogo: {
    fontSize: '48px',
    marginBottom: '10px'
  },
  partnerName: {
    fontSize: '14px',
    color: '#9ca3af'
  },
  
  // Newsletter Styles
  newsletterSection: {
    maxWidth: '700px',
    margin: '80px auto'
  },
  newsletterCard: {
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2))',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    padding: '50px 30px',
    textAlign: 'center'
  },
  newsletterTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  newsletterText: {
    fontSize: '18px',
    color: '#d1d5db',
    marginBottom: '30px'
  },
  newsletterForm: {
    display: 'flex',
    gap: '10px',
    maxWidth: '500px',
    margin: '0 auto 20px',
    flexWrap: 'wrap'
  },
  emailInput: {
    flex: 1,
    minWidth: '250px',
    padding: '14px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '16px',
    outline: 'none'
  },
  subscribeBtn: {
    padding: '14px 30px',
    background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  successMessage: {
    padding: '15px',
    background: 'rgba(16, 185, 129, 0.2)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '12px',
    color: '#10b981',
    marginBottom: '20px'
  },
  privacyNote: {
    fontSize: '14px',
    color: '#9ca3af'
  }
};

export default AdditionalModules;