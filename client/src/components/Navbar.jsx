import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    Brain, Menu, X, LogOut, User, LayoutDashboard, Trophy,
    ChevronDown, Zap, BookOpen, Star, DollarSign
} from 'lucide-react';

const publicNav = [
    { to: '/features', label: 'Features', icon: Zap },
    { to: '/how-it-works', label: 'How It Works', icon: BookOpen },
    { to: '/testimonials', label: 'Testimonials', icon: Star },
    { to: '/pricing', label: 'Pricing', icon: DollarSign },
];

const appNav = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/resume', label: 'Resume' },
    { to: '/interview/setup', label: 'Interview' },
    { to: '/leaderboard', label: 'Leaderboard' },
];

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    }, []);

    useEffect(() => { setMobileOpen(false); setProfileOpen(false); }, [location]);

    const handleLogout = () => { logout(); navigate('/'); };
    const navLinks = user
        ? [...appNav, ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : [])]
        : publicNav;
    const isActive = (to) => location.pathname === to;

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={scrolled ? 'navbar navbar-scrolled' : 'navbar'}
                style={{ zIndex: 100 }}>

                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>

                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
                        <div className="icon-box icon-box-sm">
                            <Brain size={18} color="white" />
                        </div>
                        <span style={{
                            fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.125rem',
                            background: 'linear-gradient(135deg,#FF2E63,#e50000)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>InterviewAI</span>
                    </Link>

                    {/* Desktop links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="desktop-nav">
                        {navLinks.map(link => (
                            <Link key={link.to} to={link.to}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '8px 14px', borderRadius: 12, textDecoration: 'none',
                                    fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s',
                                    color: isActive(link.to) ? 'var(--pink)' : '#4b5563',
                                    background: isActive(link.to) ? 'rgba(255,46,99,0.07)' : 'transparent',
                                }}
                                onMouseEnter={e => { if (!isActive(link.to)) { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.color = '#111827'; } }}
                                onMouseLeave={e => { if (!isActive(link.to)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4b5563'; } }}>
                                {link.icon && <link.icon size={13} />}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }} className="desktop-nav">
                        {user ? (
                            <div style={{ position: 'relative' }}>
                                <button onClick={() => setProfileOpen(!profileOpen)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        padding: '7px 12px', borderRadius: 14, cursor: 'pointer',
                                        border: '1.5px solid rgba(255,46,99,0.15)', background: 'white',
                                        transition: 'all 0.2s',
                                    }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--pink), var(--red))',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white', fontSize: '0.8125rem', fontWeight: 800,
                                    }}>
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{user.name?.split(' ')[0]}</span>
                                    <ChevronDown size={12} color="#9ca3af" style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                </button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ duration: 0.15 }}
                                            style={{
                                                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                                                width: 200, background: 'white', borderRadius: 16,
                                                boxShadow: '0 12px 40px rgba(0,0,0,0.10), 0 4px 16px rgba(255,46,99,0.08)',
                                                border: '1px solid rgba(255,46,99,0.10)',
                                                padding: '8px', zIndex: 200,
                                            }}>
                                            {[
                                                { to: '/profile', label: 'Profile', Icon: User },
                                                { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
                                                { to: '/leaderboard', label: 'Leaderboard', Icon: Trophy },
                                            ].map(({ to, label, Icon }) => (
                                                <Link key={to} to={to}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: 10,
                                                        padding: '9px 12px', borderRadius: 10, textDecoration: 'none',
                                                        fontSize: '0.875rem', color: '#374151', fontWeight: 500,
                                                        transition: 'all 0.15s',
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#fff0f4'; e.currentTarget.style.color = 'var(--pink)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#374151'; }}>
                                                    <Icon size={14} /> {label}
                                                </Link>
                                            ))}
                                            <div style={{ height: 1, background: '#f3f4f6', margin: '6px 0' }} />
                                            <button onClick={() => { setProfileOpen(false); handleLogout(); }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 10,
                                                    padding: '9px 12px', borderRadius: 10, width: '100%', cursor: 'pointer',
                                                    fontSize: '0.875rem', color: '#ef4444', fontWeight: 500,
                                                    background: 'transparent', border: 'none', transition: 'all 0.15s',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                <LogOut size={14} /> Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Link to="/login" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', textDecoration: 'none', padding: '8px 14px', borderRadius: 12, transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--pink)'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                                    Login
                                </Link>
                                <Link to="/signup" className="btn btn-primary btn-sm">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="mobile-menu-btn"
                        style={{
                            padding: '8px', borderRadius: 12, border: '1.5px solid #e5e7eb',
                            background: 'white', cursor: 'pointer', display: 'none',
                        }}>
                        {mobileOpen ? <X size={20} color="#374151" /> : <Menu size={20} color="#374151" />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'fixed', top: 'var(--nav-height)', left: 0, right: 0,
                            background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)',
                            borderBottom: '1px solid rgba(255,46,99,0.08)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                            zIndex: 99, padding: '12px 24px 20px',
                        }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {navLinks.map(link => (
                                <Link key={link.to} to={link.to}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '11px 14px', borderRadius: 12, textDecoration: 'none',
                                        fontSize: '0.9375rem', fontWeight: 600,
                                        color: isActive(link.to) ? 'var(--pink)' : '#374151',
                                        background: isActive(link.to) ? 'rgba(255,46,99,0.07)' : 'transparent',
                                    }}>
                                    {link.icon && <link.icon size={15} />}
                                    {link.label}
                                </Link>
                            ))}
                            <div style={{ height: 1, background: '#f3f4f6', margin: '8px 0' }} />
                            {user ? (
                                <button onClick={handleLogout}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                                        borderRadius: 12, width: '100%', cursor: 'pointer', border: 'none',
                                        background: 'transparent', fontSize: '0.9375rem', fontWeight: 600, color: '#ef4444',
                                    }}>
                                    <LogOut size={15} /> Logout
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                                    <Link to="/login" className="btn btn-ghost btn-sm" style={{ flex: 1, textAlign: 'center' }}>Login</Link>
                                    <Link to="/signup" className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center' }}>Get Started</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Responsive CSS injected */}
            <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
        </>
    );
}
