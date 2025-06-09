import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HeaderLogo from '../../assets/images/logos/Header-logo.svg';
import MagnifyingGlass from '../../assets/images/icons/magnifying-glass.svg';
import PlusCircle from '../../assets/images/icons/plus-circle.svg';
import UserCircle from '../../assets/images/icons/user-circle.svg';
import { useAuth } from '../../contexts/AuthContext';
import { useScrollDirection } from '../../hooks/useScrollDirection';

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
          <nav className="flex">
            <Link 
              to="/presentation" 
              className={`text-sm sm:text-base font-bold transition-colors duration-200 ${
                location.pathname === '/presentation' 
                  ? 'text-hive-yellow' 
                  : 'text-hive-black hover:text-hive-black/80'
              }`}
            >
              Présentation
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/discover" 
            className="block w-10 h-10 rounded-lg border border-hive-black shadow-[0_3px_0_0_#111111] transition-all duration-200 hover:translate-y-[3px] hover:shadow-none bg-hive-orange"
          >
            <img src={MagnifyingGlass} alt="Rechercher" className="w-full h-full p-2" />
          </Link>
          {currentUser ? (
            <>
              <Link 
                to="/creer-post" 
                className="block w-10 h-10 rounded-lg border border-hive-black shadow-[0_3px_0_0_#111111] transition-all duration-200 hover:translate-y-[3px] hover:shadow-none bg-hive-pink"
              >
                <img src={PlusCircle} alt="Créer" className="w-full h-full p-2" />
              </Link>
              <Link 
                to="/profile" 
                className="block w-10 h-10 rounded-lg border border-hive-black shadow-[0_3px_0_0_#111111] transition-all duration-200 hover:translate-y-[3px] hover:shadow-none bg-hive-purple relative"
              >
                <img src={UserCircle} alt="Profil" className="w-full h-full p-2" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-hive-yellow rounded-full border border-hive-black"></span>
              </Link>
            </>
          ) : (
            <Link 
              to="/connexion" 
              className="block w-10 h-10 rounded-lg border border-hive-black shadow-[0_3px_0_0_#111111] transition-all duration-200 hover:translate-y-[3px] hover:shadow-none bg-hive-purple"
            >
              <img src={UserCircle} alt="Connexion" className="w-full h-full p-2" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;