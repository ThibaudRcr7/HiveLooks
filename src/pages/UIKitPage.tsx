import { FC } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MagnifyingGlass from '../assets/images/icons/magnifying-glass.svg';
import PlusCircle from '../assets/images/icons/plus-circle.svg';
import UserCircle from '../assets/images/icons/user-circle.svg';

const UIKitPage: FC = () => {
  return (
    <div className="min-h-screen bg-hive-pale py-16">
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-piepie text-center mb-16 relative"
        >
          <span className="text-hive-black [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-1 z-0">UI KIT</span>
          <span className="text-hive-pale [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">UI KIT</span>
        </motion.h1>

        {/* Navigation */}
        <nav className="flex justify-center gap-4 mb-16">
          <a href="#typography" className="px-4 py-2 bg-hive-yellow rounded-lg border border-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none transition-all duration-200">Typographie</a>
          <a href="#colors" className="px-4 py-2 bg-hive-pink rounded-lg border border-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none transition-all duration-200">Couleurs</a>
          <a href="#components" className="px-4 py-2 bg-hive-purple rounded-lg border border-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none transition-all duration-200">Composants</a>
        </nav>

        {/* Section Typographie */}
        <section id="typography" className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-piepie mb-8"
          >
            Typographie
          </motion.h2>

          <div className="grid gap-8">
            {/* Titres */}
            <div className="bg-white rounded-[32px] border-[2px] border-hive-black p-8 shadow-[8px_8px_0_0_#FFAF02,_8px_8px_0_2px_#111111]">
              <h3 className="text-xl font-piepie mb-4">Titres</h3>
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-piepie">Titre H1</h1>
                  <p className="text-sm text-hive-black/60 mt-2">Piepie • 36px - 72px • Bold</p>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-piepie">Titre H2</h2>
                  <p className="text-sm text-hive-black/60 mt-2">Piepie • 24px - 48px • Semi-bold</p>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-piepie">Titre H3</h3>
                  <p className="text-sm text-hive-black/60 mt-2">Piepie • 20px - 36px • Medium</p>
                </div>
              </div>
            </div>

            {/* Texte courant */}
            <div className="bg-white rounded-[32px] border-[2px] border-hive-black p-8 shadow-[8px_8px_0_0_#FFAF02,_8px_8px_0_2px_#111111]">
              <h3 className="text-xl font-piepie mb-4">Texte courant</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-lg">Texte grand (18px)</p>
                  <p className="text-sm text-hive-black/60 mt-2">Satoshi • 18px • Regular</p>
                </div>
                <div>
                  <p className="text-base">Texte normal (16px)</p>
                  <p className="text-sm text-hive-black/60 mt-2">Satoshi • 16px • Regular</p>
                </div>
                <div>
                  <p className="text-sm">Texte petit (14px)</p>
                  <p className="text-sm text-hive-black/60 mt-2">Satoshi • 14px • Regular</p>
                </div>
              </div>
            </div>

            {/* Poids de police */}
            <div className="bg-white rounded-[32px] border-[2px] border-hive-black p-8 shadow-[8px_8px_0_0_#FFAF02,_8px_8px_0_2px_#111111]">
              <h3 className="text-xl font-piepie mb-4">Poids de police</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-bold">Bold (700)</p>
                  <p className="text-sm text-hive-black/60 mt-2">Satoshi • 16px</p>
                </div>
                <div>
                  <p className="font-semibold">Semi-bold (600)</p>
                  <p className="text-sm text-hive-black/60 mt-2">Satoshi • 16px</p>
                </div>
                <div>
                  <p className="font-medium">Medium (500)</p>
                  <p className="text-sm text-hive-black/60 mt-2">Satoshi • 16px</p>
                </div>
                <div>
                  <p className="font-normal">Regular (400)</p>
                  <p className="text-sm text-hive-black/60 mt-2">Satoshi • 16px</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Couleurs */}
        <section id="colors" className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-piepie mb-8"
          >
            Couleurs
          </motion.h2>

          <div className="grid gap-8">
            {/* Couleurs principales */}
            <div className="bg-white rounded-[32px] border-[2px] border-hive-black p-8 shadow-[8px_8px_0_0_#FFAF02,_8px_8px_0_2px_#111111]">
              <h3 className="text-xl font-piepie mb-4">Couleurs principales</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="w-full h-24 bg-hive-yellow rounded-lg border border-hive-black"></div>
                  <p className="font-medium">Hive Yellow</p>
                  <p className="text-sm text-hive-black/60">#FFAF02</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-24 bg-hive-pink rounded-lg border border-hive-black"></div>
                  <p className="font-medium">Hive Pink</p>
                  <p className="text-sm text-hive-black/60">#FF5C8D</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-24 bg-hive-purple rounded-lg border border-hive-black"></div>
                  <p className="font-medium">Hive Purple</p>
                  <p className="text-sm text-hive-black/60">#9B5DE5</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-24 bg-hive-orange rounded-lg border border-hive-black"></div>
                  <p className="font-medium">Hive Orange</p>
                  <p className="text-sm text-hive-black/60">#F15BB5</p>
                </div>
              </div>
            </div>

            {/* Couleurs neutres */}
            <div className="bg-white rounded-[32px] border-[2px] border-hive-black p-8 shadow-[8px_8px_0_0_#FFAF02,_8px_8px_0_2px_#111111]">
              <h3 className="text-xl font-piepie mb-4">Couleurs neutres</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="w-full h-24 bg-hive-black rounded-lg border border-hive-black"></div>
                  <p className="font-medium">Hive Black</p>
                  <p className="text-sm text-hive-black/60">#111111</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-24 bg-hive-pale rounded-lg border border-hive-black"></div>
                  <p className="font-medium">Hive Pale</p>
                  <p className="text-sm text-hive-black/60">#F5F5F5</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-24 bg-white rounded-lg border border-hive-black"></div>
                  <p className="font-medium">White</p>
                  <p className="text-sm text-hive-black/60">#FFFFFF</p>
                </div>
              </div>
            </div>

            {/* Opacités */}
            <div className="bg-white rounded-[32px] border-[2px] border-hive-black p-8 shadow-[8px_8px_0_0_#FFAF02,_8px_8px_0_2px_#111111]">
              <h3 className="text-xl font-piepie mb-4">Opacités</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="w-full h-24 bg-hive-black/90 rounded-lg border border-hive-black"></div>
                  <p className="font-medium">90%</p>
                  <p className="text-sm text-hive-black/60">bg-hive-black/90</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-24 bg-hive-black/60 rounded-lg border border-hive-black"></div>
                  <p className="font-medium">60%</p>
                  <p className="text-sm text-hive-black/60">bg-hive-black/60</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-24 bg-hive-black/30 rounded-lg border border-hive-black"></div>
                  <p className="font-medium">30%</p>
                  <p className="text-sm text-hive-black/60">bg-hive-black/30</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-24 bg-hive-black/10 rounded-lg border border-hive-black"></div>
                  <p className="font-medium">10%</p>
                  <p className="text-sm text-hive-black/60">bg-hive-black/10</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Composants */}
        <section id="components" className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-piepie mb-8"
          >
            Composants
          </motion.h2>

          <div className="grid gap-8">
            {/* Boutons */}
            <div className="bg-white rounded-[32px] border-[2px] border-hive-black p-8 shadow-[8px_8px_0_0_#FFAF02,_8px_8px_0_2px_#111111]">
              <h3 className="text-xl font-piepie mb-4">Boutons</h3>
              <div className="space-y-8">
                {/* Boutons primaires */}
                <div>
                  <p className="text-2xl font-satoshi mb-4">Boutons primaires</p>
                  <div className="flex flex-wrap gap-4">
                    <button className="px-6 py-3 bg-hive-yellow rounded-lg border border-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none transition-all duration-200">
                      Bouton jaune
                    </button>
                    <button className="px-6 py-3 bg-hive-pink rounded-lg border border-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none transition-all duration-200">
                      Bouton rose
                    </button>
                    <button className="px-6 py-3 bg-hive-purple rounded-lg border border-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none transition-all duration-200">
                      Bouton violet
                    </button>
                    <button className="px-6 py-3 bg-hive-orange rounded-lg border border-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none transition-all duration-200">
                      Bouton orange
                    </button>
                  </div>
                </div>

                {/* Boutons avec icônes */}
                <div>
                  <p className="text-2xl font-satoshi mb-4">Boutons avec icônes</p>
                  <div className="flex gap-4">
                    <Link 
                      to="/discover" 
                      className="block w-10 h-10 rounded-lg border border-hive-black shadow-[0_3px_0_0_#111111] transition-all duration-200 hover:translate-y-[3px] hover:shadow-none bg-hive-orange"
                    >
                      <img src={MagnifyingGlass} alt="Rechercher" className="w-full h-full p-2" />
                    </Link>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UIKitPage; 