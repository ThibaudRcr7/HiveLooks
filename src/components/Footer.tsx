import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-hive-black border-t-2 border-hive-black mt-auto rounded-t-[32px]">
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Infos */}
          <div>
            <h3 className="font-piepie text-xl mb-4 text-hive-yellow">INFOS</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/presentation" className="text-white hover:text-white/80">À propos</Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-white hover:text-white/80">Ui-kit</Link>
              </li>
              <li>
                <Link to="/conditions" className="text-white hover:text-white/80">Crédits</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-piepie text-xl mb-4 text-hive-yellow">CONTACT</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contact@hivelooks.be" className="text-white hover:text-white/80">contact@hivelooks.be</a>
              </li>
              <li>
                <a href="tel:+32123456789" className="text-white hover:text-white/80">+32 123 45 67 89</a>
              </li>
              <li className="text-white">Rue de la Ruche 1,<br />1000 Bruxelles</li>
            </ul>
          </div>

          {/* Réseaux */}
          <div>
            <h3 className="font-piepie text-xl mb-4">RÉSEAUX</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://instagram.com/hivelooks" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80">Instagram</a>
              </li>
              <li>
                <a href="https://facebook.com/hivelooks" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80">Facebook</a>
              </li>
              <li>
                <a href="https://twitter.com/hivelooks" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80">Twitter</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Portfolio Link */}
        <div className="border-t-2 border-hive-black pt-6 text-center">
          <a
            href="https://thibaultmorizet.be"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-white/80 font-piepie"
          >
            Thibaud Rocour
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;