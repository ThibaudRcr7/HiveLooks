import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-hive-black border-t-2 border-hive-black mt-auto rounded-t-3xl">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12 mb-12">
          {/* Infos */}
          <div>
            <h3 className="font-piepie text-2xl mb-6 text-hive-yellow">INFOS</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/presentation" className="text-white hover:text-white/80 transition-colors duration-200 text-base">Présentation</Link>
              </li>
              <li>
                <Link to="/conditions" className="text-white hover:text-white/80 transition-colors duration-200 text-base">Crédits</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-piepie text-2xl mb-6 text-hive-yellow">CONTACT</h3>
            <ul className="space-y-4">
              <li>
                <a href="mailto:contact@hivelooks.be" className="text-white hover:text-white/80 transition-colors duration-200 text-base">contact@hivelooks.be</a>
              </li>
              <li>
                <a href="tel:+32123456789" className="text-white hover:text-white/80 transition-colors duration-200 text-base">+32 123 45 67 89</a>
              </li>
              <li className="text-white text-base leading-relaxed">Rue de la Ruche 1,<br />1000 Bruxelles</li>
            </ul>
          </div>

          {/* Réseaux */}
          <div>
            <h3 className="font-piepie text-2xl mb-6 text-hive-yellow">RÉSEAUX</h3>
            <ul className="space-y-4">
              <li>
                <a href="https://instagram.com/hivelooks" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors duration-200 text-base">Instagram</a>
              </li>
              <li>
                <a href="https://facebook.com/hivelooks" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors duration-200 text-base">Facebook</a>
              </li>
              <li>
                <a href="https://twitter.com/hivelooks" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors duration-200 text-base">Twitter</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Portfolio Link */}
        <div className="border-t-2 border-hive-black pt-8 text-center">
          <a
            href="https://thibaultmorizet.be"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-white/80 transition-colors duration-200 font-piepie text-lg"
          >
            Thibaud Rocour
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;