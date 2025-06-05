import { Link, useLocation } from 'react-router-dom';
import HeaderLogo from '../assets/images/logos/Header-logo.svg';
import { useAuth } from '../contexts/AuthContext';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { useState, useEffect, useCallback } from 'react';

const Header = () => {
  const { currentUser } = useAuth();
  const scrollDirection = useScrollDirection();
  const location = useLocation();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg transition-all duration-300 ${scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link to="/" onClick={handleLogoClick} className={`block w-10 h-10 rounded-lg border border-hive-black shadow-[0_3px_0_0_#111111] transition-all duration-200 hover:translate-y-[3px] hover:shadow-none ${location.pathname === '/' ? 'bg-hive-yellow' : 'bg-hive-beige'}`}>
            <img src={HeaderLogo} alt="HiveLooks Logo" className="w-full h-full p-2" />
          </Link>
          <nav className="flex">
            <Link to="/presentation" className="text-sm sm:text-base font-bold text-hive-black hover:text-hive-black/80 transition-colors duration-200">
              Présentation
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/discover" className="block p-2 bg-hive-orange rounded-lg border border-hive-black shadow-[0_3px_0_0_#111111] text-hive-black transition-all duration-200 hover:translate-y-[3px] hover:shadow-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </Link>
          <Link to="/creer-post" className="block p-2 bg-hive-pink rounded-lg border border-hive-black shadow-[0_3px_0_0_#111111] text-hive-black transition-all duration-200 hover:translate-y-[3px] hover:shadow-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
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


    </header>
  );
};

export default Header;