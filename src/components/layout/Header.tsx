import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HeaderLogo from '../../assets/images/logos/Header-logo.svg';
import { useAuth } from '../../contexts/AuthContext';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import Button from '../common/Button';

const Header: FC = () => {
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
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
      }`}
      role="banner"
      aria-label="En-tête du site"
    >
      <div className="max-w-[1400px] mx-auto w-full flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link 
            to="/" 
            onClick={handleLogoClick} 
            className="block w-[40px] h-[40px] bg-hive-beige rounded-lg border-[1px] border-[#111111] shadow-[0_3px_0_0_#111111] box-border transition-all duration-200 hover:translate-y-[3px] hover:shadow-none"
            aria-label="Retour à l'accueil"
          >
            <img src={HeaderLogo} alt="Logo HiveLooks" className="w-full h-full p-2" />
          </Link>
          <nav className="flex gap-6" aria-label="Navigation principale">
            <Link 
              to="/presentation" 
              className="text-hive-black hover:text-hive-black/80 transition-colors"
            >
              Présentation
            </Link>
            <Link 
              to="/a-propos" 
              className="text-hive-black hover:text-hive-black/80 transition-colors"
            >
              À propos
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/discover" 
            aria-label="Découvrir"
            className="block p-2 bg-hive-orange rounded-lg border-[1px] border-[#111111] shadow-[0_3px_0_0_#111111] text-hive-black transition-all duration-200 hover:translate-y-[3px] hover:shadow-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </Link>
          <Link 
            to="/creer-post" 
            aria-label="Créer un post"
            className="block p-2 bg-hive-pink rounded-lg border-[1px] border-[#111111] shadow-[0_3px_0_0_#111111] text-hive-black transition-all duration-200 hover:translate-y-[3px] hover:shadow-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </Link>
          {currentUser ? (
            <Link
              to="/profile"
              aria-label="Profil"
              className="block p-2 bg-hive-purple rounded-lg border-[1px] border-[#111111] shadow-[0_3px_0_0_#111111] text-hive-black transition-all duration-200 hover:translate-y-[3px] hover:shadow-none relative"
            >
              <div 
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-hive-black"
                aria-label="Connecté"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </Link>
          ) : (
            <Button
              as={Link}
              to="/connexion"
              variant="primary"
              size="md"
            >
              Se connecter
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;