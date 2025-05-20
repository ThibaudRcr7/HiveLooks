import { Link, useLocation } from 'react-router-dom';
import HeaderLogo from '../assets/images/logos/Header-logo.svg';
import { useAuth } from '../contexts/AuthContext';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { useState, useEffect, useCallback } from 'react';

const Header = () => {
  const { currentUser } = useAuth();
  const scrollDirection = useScrollDirection();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [handleEscape]);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="max-w-[1400px] mx-auto w-full flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="block lg:hidden p-2 bg-hive-pink rounded-lg border-[1px] border-[#111111] shadow-[4px_4px_0_#111] text-hive-black transition-all duration-200 hover:translate-y-[4px] hover:shadow-none order-last"
            aria-label="Menu de navigation"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 transition-transform duration-300"
              style={{ transform: isMobileMenuOpen ? 'rotate(45deg)' : 'none' }}
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
          <Link to="/" onClick={handleLogoClick} className="block w-[40px] h-[40px] bg-hive-beige rounded-lg border-[1px] border-[#111111] shadow-[0_3px_0_0_#111111] box-border transition-all duration-200 hover:translate-y-[3px] hover:shadow-none">
            <img src={HeaderLogo} alt="HiveLooks Logo" className="w-full h-full p-2" />
          </Link>
          <nav className="hidden lg:flex gap-6">
            <Link to="/presentation" className="text-hive-black hover:text-hive-black/80">
              Présentation
            </Link>
            <Link to="/a-propos" className="text-hive-black hover:text-hive-black/80">
              À propos
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/discover" className="block p-2 bg-hive-orange rounded-lg border-[1px] border-[#111111] shadow-[0_3px_0_0_#111111] text-hive-black transition-all duration-200 hover:translate-y-[3px] hover:shadow-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </Link>
          <Link to="/creer-post" className="block p-2 bg-hive-pink rounded-lg border-[1px] border-[#111111] shadow-[0_3px_0_0_#111111] text-hive-black transition-all duration-200 hover:translate-y-[3px] hover:shadow-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </Link>
          {currentUser ? (
            <Link
              to="/profile"
              className="block p-2 bg-hive-purple rounded-lg border-[1px] border-[#111111] shadow-[0_3px_0_0_#111111] text-hive-black transition-all duration-200 hover:translate-y-[3px] hover:shadow-none relative"
            >
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-hive-black"></div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </Link>
          ) : (
            <Link to="/connexion" className="block px-4 py-2 bg-hive-purple rounded-lg border-[1px] border-[#111111] shadow-[0_3px_0_0_#111111] text-hive-black transition-all duration-200 hover:translate-y-[3px] hover:shadow-none">
              Se connecter
            </Link>
          )}
        </div>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-hive-black/40 transition-opacity duration-300 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Menu slide-in */}
          <div
            id="mobile-menu"
            className="fixed top-0 right-0 h-full w-64 bg-hive-beige border-l-2 border-hive-black transform transition-transform duration-300 ease-in-out z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation mobile"
          >
            <div className="flex flex-col justify-center h-full p-6 space-y-8 font-piepie text-2xl">
              <Link
                to="/presentation"
                className="block text-hive-black hover:text-hive-black/80"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Présentation
              </Link>
              <Link
                to="/a-propos"
                className="block text-hive-black hover:text-hive-black/80"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                À propos
              </Link>
              {currentUser ? (
                <Link
                  to="/profile"
                  className="block text-hive-black hover:text-hive-black/80"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mon profil
                </Link>
              ) : (
                <Link
                  to="/connexion"
                  className="block text-hive-black hover:text-hive-black/80"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Se connecter
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;