import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const isAdmin = user?.role === "admin";

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={styles.bgBlobs}>
        <div style={{...styles.blob, top: '-10%', left: '-10%', background: '#a855f7'}}></div>
        <div style={{...styles.blob, top: '-5%', right: '-10%', background: '#3b82f6', animationDelay: '2s'}}></div>
        <div style={{...styles.blob, bottom: '-10%', left: '50%', background: '#ec4899', animationDelay: '4s'}}></div>
      </div>

      {/* Sidebar */}
      <div style={{...styles.sidebar, ...(sidebarOpen ? {} : styles.sidebarClosed)}}>
        <div style={styles.sidebarTop}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={styles.toggleButton}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #a855f7, #3b82f6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
          ☰
          </button>
          {sidebarOpen && <div style={styles.menuLabelTop}>MENU</div>}
        </div>

        {user && (
          <div style={styles.userCard}>
            <div style={styles.userAvatar}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div style={styles.userDetails}>
                <p style={styles.userName}>{user.name}</p>
                <p style={styles.userEmail}>{user.email}</p>
                <div style={{
                  ...styles.roleBadge,
                  ...(isAdmin ? styles.adminBadge : styles.userBadge)
                }}>
                  {isAdmin ? "👑 Admin" : "👤 User"}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={styles.sidebarDivider}></div>

        <div style={styles.sidebarMenu}>
          <div style={styles.menuSection}>
            {sidebarOpen && <div style={styles.menuLabel}>QUICK ACCESS</div>}
            <div style={styles.statItem}>
              <span style={styles.statIcon}>📊</span>
              {sidebarOpen && (
                <div style={styles.statInfo}>
                  <div style={styles.statValue}>14</div>
                  <div style={styles.statLabel}>Features</div>
                </div>
              )}
            </div>
            <div style={styles.statItem}>
              <span style={styles.statIcon}>⚡</span>
              {sidebarOpen && (
                <div style={styles.statInfo}>
                  <div style={styles.statValue}>Active</div>
                  <div style={styles.statLabel}>Status</div>
                </div>
                
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={styles.sidebarLogout}
          onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)'}
          onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)'}
        >
          <span style={styles.logoutIcon}>🚪</span>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>

      {/* Main Content */}
      <div style={{...styles.mainContent, ...(sidebarOpen ? {} : styles.mainContentExpanded)}}>
        <div style={styles.topBar}>
          <h1 style={styles.title}>Welcome Back! 🎉</h1>
          <div style={styles.topBarActions}>
            <div style={styles.logoTopBar}>
              <div style={styles.logoIcon}>⚡</div>
              <span style={styles.logoText}>DashSphere</span>
            </div>
          </div>
        </div>

        <div style={styles.contentWrapper}>
          {/* Features Grid */}
          <div style={styles.featuresSection}>
            <h2 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>🚀</span>
              Your Features
            </h2>
            <div style={styles.grid}>
              <Link to="/weather" style={styles.card} className="feature-card">
                <div style={styles.cardIcon}>🌦</div>
                <div style={styles.cardLabel}>Weather</div>
              </Link>
              
              <Link to="/trivia" style={styles.card} className="feature-card">
                <div style={styles.cardIcon}>🎮</div>
                <div style={styles.cardLabel}>Trivia</div>
              </Link>
              
              <Link to="/crypto" style={styles.card} className="feature-card">
                <div style={styles.cardIcon}>💰</div>
                <div style={styles.cardLabel}>Crypto</div>
              </Link>
              
              <Link to="/quotes" style={styles.card} className="feature-card">
                <div style={styles.cardIcon}>💬</div>
                <div style={styles.cardLabel}>Quotes</div>
              </Link>
              
              <Link to="/tasks" style={styles.card} className="feature-card">
                <div style={styles.cardIcon}>📝</div>
                <div style={styles.cardLabel}>Tasks</div>
              </Link>
              
              <Link to="/payment" style={styles.card} className="feature-card">
                <div style={styles.cardIcon}>💳</div>
                <div style={styles.cardLabel}>Payment</div>
              </Link>
              
              <Link to="/payment-history" style={styles.card} className="feature-card">
                <div style={styles.cardIcon}>📜</div>
                <div style={styles.cardLabel}>History</div>
              </Link>
              
              <Link to="/Covid" style={styles.card} className="feature-card">
                <div style={styles.cardIcon}>🦠</div>
                <div style={styles.cardLabel}>COVID-19</div>
              </Link>
              
              <Link to="/whatsapp-checker" style={styles.card} className="feature-card">
                <div style={styles.cardIcon}>📱</div>
                <div style={styles.cardLabel}>WhatsApp</div>
              </Link>
              
              <Link to="/web3" style={styles.card} className="feature-card">
                <div style={styles.cardIcon}>🌐</div>
                <div style={styles.cardLabel}>Web3</div>
              </Link>
              
              <Link to="/twitter" style={styles.card} className="feature-card">
                <div style={styles.cardIcon}>🐦</div>
                <div style={styles.cardLabel}>Twitter</div>
              </Link>
              
              <Link to="/tiktok-downloader" style={styles.card} className="feature-card">
                <div style={styles.cardIcon}>🎵</div>
                <div style={styles.cardLabel}>TikTok</div>
              </Link>
              
              <Link to="/betting" style={styles.card} className="feature-card">
                <div style={styles.cardIcon}>🎲</div>
                <div style={styles.cardLabel}>Betting</div>
              </Link>
              
              <Link to="/chatbot" style={styles.card} className="feature-card">
                <div style={styles.cardIcon}>🤖</div>
                <div style={styles.cardLabel}>Chatbot</div>
              </Link>
            </div>
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <div style={styles.adminSection}>
              <h2 style={styles.adminTitle}>
                <span>⚙️</span> Admin Panel
              </h2>
              <div style={styles.adminGrid}>
                <Link to="/admin/users" style={styles.adminCard} className="admin-card">
                  <div style={styles.adminCardIcon}>👥</div>
                  <div style={styles.adminCardLabel}>Users</div>
                </Link>
                
                <Link to="/admin/add-user" style={styles.adminCard} className="admin-card">
                  <div style={styles.adminCardIcon}>➕</div>
                  <div style={styles.adminCardLabel}>Add User</div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .feature-card:hover {
          box-shadow: 0 8px 25px rgba(168, 85, 247, 0.5) !important;
          border: 1px solid rgba(168, 85, 247, 0.4) !important;
          background: rgba(255, 255, 255, 0.08) !important;
        }
        
        .admin-card:hover {
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.6) !important;
          border: 2px solid rgba(139, 92, 246, 0.5) !important;
        }

        /* Custom Scrollbar Styles */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #a855f7, #3b82f6);
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #c084fc, #60a5fa);
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.7);
        }

        /* Firefox Scrollbar */
        * {
          scrollbar-width: thin;
          scrollbar-color: #a855f7 rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    position: 'relative',
    overflow: 'hidden'
  },
  bgBlobs: {
    position: 'fixed',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 0
  },
  blob: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0.15,
    animation: 'blob 7s infinite'
  },
  
  // Sidebar Styles
  sidebar: {
    width: '220px',
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 15px',
    position: 'relative',
    zIndex: 10,
    transition: 'width 0.3s ease',
    overflow: 'hidden'
  },
  sidebarClosed: {
    width: '70px',
    padding: '20px 12px'
  },
  sidebarTop: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  toggleButton: {
    width: '68px',
    height: '46px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '10px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    transition: 'all 0.3s ease',
    flexShrink: 0,
    margin: '0 auto'
  },
  menuLabelTop: {
    fontSize: '20px',
    fontWeight: '7000',
    color: '#6b7280',
    letterSpacing: '1.5px',
    textAlign: 'center'
  },
   logoIcon: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
    transform: 'translateX(35px)', // Moves the logo 5px to the right (forward)
  },
  logoText: {
    fontSize: '16px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #c084fc, #60a5fa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    whiteSpace: 'nowrap',
    marginLeft: '8px',  // Adds space between the logo icon and the text
  },
  userCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '15px 12px',
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  userAvatar: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
    flexShrink: 0
  },
  userDetails: {
    textAlign: 'center',
    width: '100%'
  },
  userName: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'white',
    margin: '0 0 3px 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  userEmail: {
    fontSize: '11px',
    color: '#9ca3af',
    margin: '0 0 8px 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  roleBadge: {
    padding: '5px 10px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  },
  adminBadge: {
    background: 'linear-gradient(135deg, #a855f7, #8b5cf6)',
    color: 'white'
  },
  userBadge: {
    background: 'rgba(156, 163, 175, 0.2)',
    color: '#d1d5db',
    border: '1px solid rgba(156, 163, 175, 0.3)'
  },
  sidebarMenu: {
    flex: 1,
    overflow: 'auto'
  },
  menuSection: {
    marginBottom: '20px'
  },
  menuLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: '10px',
    letterSpacing: '0.5px'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '10px',
    marginBottom: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  statIcon: {
    fontSize: '22px',
    flexShrink: 0
  },
  statInfo: {
    flex: 1
  },
  statValue: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '2px'
  },
  statLabel: {
    fontSize: '11px',
    color: '#9ca3af'
  },
  sidebarLogout: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '10px',
    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
  },
  logoutIcon: {
    fontSize: '16px'
  },
  
  // Main Content Styles
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden'
  },
  mainContentExpanded: {
    marginLeft: '0'
  },
  topBar: {
    padding: '20px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(15, 23, 42, 0.5)',
    backdropFilter: 'blur(10px)',
    flexShrink: 0,
    zIndex: 5
  },
  title: {
    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #fff 0%, #a78bfa 50%, #60a5fa 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0
  },
  topBarActions: {
    display: 'flex',
    gap: '10px'
  },
  badge: {
    padding: '10px 16px',
    background: 'rgba(168, 85, 247, 0.2)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '20px',
    color: '#d8b4fe',
    fontSize: '14px',
    fontWeight: '600'
  },
  contentWrapper: {
    flex: 1,
    padding: '20px 30px',
    overflow: 'auto',
    display: 'flex',
    gap: '20px',
    position: 'relative',
    zIndex: 1
  },
  featuresSection: {
    flex: 1
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  sectionIcon: {
    fontSize: '1.5rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '15px',
    height: 'calc(100vh - 280px)',
    overflowY: 'auto',
    paddingRight: '10px'
  },
  card: {
    padding: '20px 15px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    height: 'fit-content'
  },
  cardIcon: {
    fontSize: '36px',
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
  },
  cardLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    textAlign: 'center'
  },
  adminSection: {
    width: '240px',
    flexShrink: 0
  },
  adminTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  adminGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  adminCard: {
    padding: '20px 15px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.15))',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '15px',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  adminCardIcon: {
    fontSize: '36px',
    filter: 'drop-shadow(0 4px 8px rgba(168, 85, 247, 0.3))'
  },
  adminCardLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    textAlign: 'center'
  }
};