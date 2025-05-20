import { FC } from 'react';
import { Link } from 'react-router-dom';

const NotFound: FC = () => {
  return (
    <div className="min-h-screen bg-hive-beige py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-[600px] mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-piepie mb-8 relative inline-block">
          <span className="text-hive-black [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-[4px] sm:top-[6px] z-0">404</span>
          <span className="text-hive-beige [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">404</span>
        </h1>
        <p className="text-xl text-hive-black mb-8">Oups ! Cette page n'existe pas.</p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-hive-yellow text-hive-black font-bold rounded-lg border-[1px] border-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none transition-all"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;