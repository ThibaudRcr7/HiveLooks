import { FC } from 'react';
import { Link } from 'react-router-dom';
import HeaderLogo from '../assets/images/logos/Header-logo.svg';
import LinkedInLogo from '../assets/images/logos/linkedin-logo.svg';
import InstagramLogo from '../assets/images/logos/instagram-logo.svg';
import XLogo from '../assets/images/logos/x-logo.svg';

const Footer: FC = () => {
  return (
    <footer className="bg-hive-black text-white py-12 rounded-t-3xl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo et navigation */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Link to="/" className="block">
                <img src={HeaderLogo} alt="HiveLooks" className="h-6" />
              </Link>
              <h3 className="text-xl font-piepie text-hive-yellow">HiveLooks</h3>
            </div>
            <nav className="space-y-2">
              <Link to="/presentation" className="block text-white hover:text-hive-yellow transition-colors duration-200">Présentation</Link>
              <Link to="/ui-kit" className="block text-white hover:text-hive-yellow transition-colors duration-200">UI Kit</Link>
              <Link to="/credits" className="block text-white hover:text-hive-yellow transition-colors duration-200">Crédits</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-piepie text-hive-yellow mb-4">Contact</h3>
            <a 
              href="mailto:thibaud.r.design@gmail.com" 
              className="text-white hover:text-hive-yellow transition-colors duration-200"
            >
              thibaud.r.design@gmail.com
            </a>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="text-xl font-piepie text-hive-yellow mb-4">Réseaux sociaux</h3>
            <div className="flex gap-8">
              <a
                href="https://www.linkedin.com/in/thibaud-rocour-69b5a3270/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-hive-orange rounded-lg border-2 border-hive-pale shadow-[0_3px_0_0_#F5F5F5] hover:translate-y-[3px] hover:shadow-none transition-all duration-200 flex items-center justify-center transform rotate-3"
              >
                <img src={LinkedInLogo} alt="LinkedIn" className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/shino_dwt/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-hive-pink rounded-lg border-2 border-hive-pale shadow-[0_3px_0_0_#F5F5F5] hover:translate-y-[3px] hover:shadow-none transition-all duration-200 flex items-center justify-center transform -rotate-3"
              >
                <img src={InstagramLogo} alt="Instagram" className="w-6 h-6" />
              </a>
              <a
                href="https://x.com/Shino_DWT"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-hive-purple rounded-lg border-2 border-hive-pale shadow-[0_3px_0_0_#F5F5F5] hover:translate-y-[3px] hover:shadow-none transition-all duration-200 flex items-center justify-center transform rotate-3"
              >
                <img src={XLogo} alt="X (Twitter)" className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex justify-between items-center">
            <a 
              href="http://thibaud-rocour.be/projets/unlock-creativity/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-hive-yellow transition-colors duration-200"
            >
              Thibaud Rocour
            </a>
            <div className="flex items-center gap-2">
              <a href="https://dwt.heaj.be/" target="_blank" rel="noopener noreferrer">
                <svg className="w-[71.6px] h-[25px]" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 71.6 25" xmlSpace="preserve">
                  <path className="fill-white" d="M0 20.41V0h5.63c1.98 0 3.71.36 5.18 1.06 1.47.71 2.61 1.81 3.43 3.3.81 1.49 1.22 3.41 1.22 5.74 0 2.34-.4 4.27-1.21 5.79-.8 1.52-1.92 2.66-3.35 3.4-1.43.74-3.09 1.11-4.99 1.11H0zm4.63-3.73h.75c1.06 0 2-.21 2.8-.63.8-.42 1.43-1.11 1.88-2.07.45-.96.67-2.25.67-3.88s-.22-2.91-.67-3.83c-.45-.92-1.07-1.58-1.87-1.97-.8-.39-1.74-.58-2.8-.58h-.76v12.96zM19.44 20.41 16.72 0h4.79l.63 10.86c.02.88.04 1.72.05 2.54.01.81.03 1.68.05 2.6h.13c.15-.92.31-1.79.49-2.61.18-.82.35-1.66.52-2.52l1.38-5.7h2.94l1.28 5.7c.17.83.34 1.66.52 2.49.18.82.34 1.71.49 2.64h.13c.02-.94.04-1.82.06-2.64l.06-2.49L30.77 0h4.48l-2.5 20.41H27.8l-1.19-6.32c-.13-.65-.24-1.3-.34-1.97-.1-.67-.18-1.3-.22-1.91h-.09c-.06.61-.14 1.24-.22 1.91-.08.67-.19 1.33-.31 1.97l-1.19 6.32h-4.8zM42.45 20.41V3.88h-6.1V0h16.84v3.88h-6.1v16.53h-4.64z"></path>
                  <path className="fill-white" d="M57.69 20.41H71.6V25H57.69z"></path>
                </svg>
              </a>
              <span className="text-white">© 2025</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;