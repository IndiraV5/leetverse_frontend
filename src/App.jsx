import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Hero from './components/Hero';
import Leaderboard from './components/Leaderboard';
import Connect from './components/Connect';
import Particles from './components/Particles';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import AdminUpload from './pages/AdminUpload';
import AdminCurriculum from './pages/AdminCurriculum';
import AdminProgress from './pages/AdminProgress';
import Unauthorized from './pages/Unauthorized';
import Members from './pages/Members';
import Notes from './pages/Notes';
import Practice from './pages/Practice';
import ParallaxBackground from './components/ParallaxBackground';
import ReminderBanner from './components/ReminderBanner';
import ValidationModal from './components/ValidationModal';
import { ReminderProvider, useReminders } from './context/ReminderContext';
import { verifyAndComplete } from './services/api';
import { LogIn, LogOut, User as UserIcon, Shield, X } from 'lucide-react';

import { checkHealth } from './services/api';

const SystemStatus = () => {
  const [isHealthy, setIsHealthy] = React.useState(null);
  const [checking, setChecking] = React.useState(false);

  const performCheck = async () => {
    if (checking) return;
    setChecking(true);
    const healthy = await checkHealth();
    setIsHealthy(healthy);
    setChecking(false);
  };

  useEffect(() => {
    performCheck();
    const interval = setInterval(performCheck, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  if (isHealthy === true) return (
    <div className="flex items-center gap-2 group cursor-help transition-all duration-500" title="Backend Active">
      <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_#00ff9d]" />
      <span className="text-[10px] font-mono text-accent/50 group-hover:text-accent transition-colors uppercase tracking-[0.2em] lg:block hidden">System_Live</span>
    </div>
  );

  return (
    <div
      onClick={performCheck}
      className={`flex items-center gap-3 px-3 py-1.5 border rounded-sm transition-all duration-500 cursor-pointer ${isHealthy === false
        ? 'border-orange-500/30 bg-orange-500/5 text-orange-400'
        : 'border-white/10 text-white/40'
        }`}>
      <div className={`w-1.5 h-1.5 rounded-full ${isHealthy === false ? 'bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]' : 'bg-white/20'}`} />
      <span className="text-[10px] font-mono uppercase tracking-[0.15em] font-bold">
        {isHealthy === false ? 'System_Waking_Up...' : 'Syncing_Core...'}
      </span>
    </div>
  );
};

const Navigation = () => {
  const { user, login, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Members', path: '/members' },
    { name: 'Practice', path: '/practice' },
    { name: 'Notes', path: '/notes' },
    { name: 'Leaderboard', path: '/#leaderboard' },
  ];

  const handleLinkClick = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 py-4 flex items-center justify-between ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
        }`}>
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group relative z-[60]" onClick={handleLinkClick}>
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30 group-hover:border-accent/50 transition-all overflow-hidden lg:block hidden">
              <img
                src="/leetverse logo.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:hidden w-8 h-8 bg-accent/20 rounded-md flex items-center justify-center border border-accent/20">
              <img
                src="/leetverse logo.jpg"
                alt="Logo"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <span className="text-xl font-display font-bold tracking-tighter text-white group-hover:text-accent transition-colors">
              LEET<span className="text-accent underline decoration-accent/30 underline-offset-4">VERSE</span>
            </span>
          </Link>

          <SystemStatus />

          <div className="lg:flex hidden items-center gap-3">
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-sm">
              {/* <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">S: </span> */}
              <span className="text-[9px] font-mono text-accent font-bold uppercase tracking-widest">{import.meta.env.VITE_CURRENT_SEASON || 'N/A'}</span>
            </div>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-sm">
              {/* <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">L: </span> */}
              <span className="text-[9px] font-mono text-accent font-bold uppercase tracking-widest">{import.meta.env.VITE_CURRENT_LEVEL || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 text-m font-mono uppercase tracking-widest">
          {navLinks.map(link => (
            <Link key={link.name} to={link.path} className="hover:text-accent transition-colors">{link.name}</Link>
          ))}
        </div>

        {/* Auth/Profile Section (Desktop) */}
        <div className="hidden lg:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link to="/admin" className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-all" title="Admin Portal">
                  <Shield size={20} />
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:border-accent/40 transition-all">
                <UserIcon size={16} className="text-accent" />
                <span className="text-xs font-mono text-white tracking-widest">{user.rollNo}</span>
              </Link>
              <button
                onClick={logout}
                className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button
              className="group relative px-6 py-2 overflow-hidden"
              onClick={login}
            >
              <div className="absolute inset-0 border border-accent/50 group-hover:border-accent transition-colors" />
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <span className="relative flex items-center gap-2 text-xs font-mono text-white tracking-[0.2em]">
                <LogIn size={14} className="text-accent" />
                REGISTER / LOGIN
              </span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden relative z-[110] p-2 text-accent"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <div className="space-y-1.5 w-6">
            <div className="h-0.5 bg-accent w-full" />
            <div className="h-0.5 bg-accent w-full" />
            <div className="h-0.5 bg-accent w-full" />
          </div>}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-background z-[105] transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} lg:hidden flex flex-col items-center justify-center p-8 space-y-12 overflow-y-auto`}>
        <div className="flex flex-col items-center gap-10 text-2xl font-display font-bold uppercase tracking-[0.2em]">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={handleLinkClick}
              className="hover:text-accent transition-all hover:scale-110 active:scale-95"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="h-[1px] w-12 bg-white/10 shrink-0" />

        <div className="flex flex-col items-center gap-8 pb-12 w-full max-w-xs">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" onClick={handleLinkClick} className="flex items-center gap-3 text-accent font-mono text-sm tracking-widest text-center py-2 px-6 border border-accent/20 rounded-full w-full justify-center">
                  <Shield size={18} /> ADMIN_PORTAL
                </Link>
              )}
              <Link to="/profile" onClick={handleLinkClick} className="flex items-center gap-3 text-white font-mono text-sm tracking-widest text-center py-2 px-6 border border-white/10 rounded-full w-full justify-center">
                <UserIcon size={18} className="text-accent" /> {user.rollNo}
              </Link>
              <button
                onClick={() => { logout(); handleLinkClick(); }}
                className="flex items-center gap-2 text-red-400 font-mono text-xs tracking-widest hover:text-red-300 transition-colors"
              >
                <LogOut size={16} /> LOGOUT_SESSION
              </button>
            </>
          ) : (
            <button
              className="w-full py-4 border border-accent/40 text-accent font-mono text-sm tracking-[0.3em] font-bold hover:bg-accent/5 active:bg-accent/10 transition-all rounded-sm uppercase"
              onClick={() => { login(); handleLinkClick(); }}
            >
              Access Portal
            </button>
          )}
        </div>
      </div>
    </>
  );
};

const HomePage = () => (
  <main className="relative z-10">
    <Hero />
    <Leaderboard />
    <Connect />
  </main>
);

function AppContent() {
  const { isUnauthorized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("%c LEETVERSE v1.0 %c INITIATED ", "color: #050505; background: #00ff9d; font-weight: bold;", "color: #00ff9d; background: #111111;");
  }, []);

  const { showValidation, selectedQuestion, closeValidation, refreshReminders } = useReminders();
  const { user } = useAuth();

  const handleGlobalVerify = async (responses) => {
    const data = {
        rollNo: user.rollNo,
        ...responses
    };
    const res = await verifyAndComplete(data);
    await refreshReminders();
    return res;
  };

  useEffect(() => {
    if (isUnauthorized) {
      navigate('/unauthorized');
    }
  }, [isUnauthorized, navigate]);

  // 👇 Scroll to hash target when location changes
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // optional: scroll to top when no hash
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-background text-white overflow-x-hidden w-full relative">
      {/* Visual background layers */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-[0.15]" />
      <div className="fixed inset-0 bg-gradient-to-tr from-background via-transparent to-accent/5 pointer-events-none" />
      <div className="fixed top-0 right-0 w-[50vw] h-full bg-gradient-to-l from-accent/10 to-transparent pointer-events-none z-0 blur-[160px] opacity-40" />

      <ParallaxBackground />
      <Particles />

      {/* Background terminal scan-line effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.015]">
        <div className="w-full h-[0.5px] bg-accent/30 animate-scanline shadow-[0_0_8px_rgba(0,255,157,0.3)]" />
      </div>

      <Navigation />

      <main className="relative z-10 w-full overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<Dashboard />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/admin" element={<AdminUpload />} />
          <Route path="/admin/curriculum" element={<AdminCurriculum />} />
          <Route path="/admin/progress" element={<AdminProgress />} />
          <Route path="/members" element={<Members />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </main>

      <ReminderBanner />
      
      {showValidation && (
        <ValidationModal 
            question={selectedQuestion} 
            onClose={closeValidation} 
            onVerify={handleGlobalVerify}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ReminderProvider>
          <AppContent />
        </ReminderProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;