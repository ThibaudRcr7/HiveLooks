import { FC } from 'react';
import { Link } from 'react-router-dom';
import HeaderLogo from '../assets/images/logos/Header-logo.svg';
import '../assets/styles/animations.css';
import { useAnimations } from '../hooks/useAnimations';
import heroImage from '../assets/images/hero-image.jpg';
import pullBleu from '../assets/images/photos/Pull-bleu.png';
import BulleTexte from '../assets/images/illustrations/Bulle-texte.svg';
import abeilleEtape2 from '../assets/images/illustrations/abeille-etape2.png';
import selectAbeille1 from '../assets/images/illustrations/select-abeille-1.png';
import StepThreeAnimation from '../components/StepThreeAnimation';

const HomePage: FC = () => {
  useAnimations();

  return (
    <div>
      <main className="bg-hive-beige overflow-x-hidden flex flex-col gap-[8rem] px-4 sm:px-6 lg:px-8" role="main">
        <section className="min-h-screen flex items-center max-w-[1400px] mx-auto" aria-label="Section principale">
          <div className="flex flex-col lg:flex-row justify-between relative z-10 w-full gap-8 lg:gap-12">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-piepie leading-tight w-full lg:min-w-[700px] flex flex-col tracking-[0.05em] relative">
                <span className="relative inline-block">
                  <span className="text-hive-black [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-[4px] sm:top-[6px] z-0">BIENVENUE</span>
                  <span className="text-hive-beige [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">BIENVENUE</span>
                </span>
                <span>DANS LA RUCHE !</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-[20px] text-hive-black leading-relaxed max-w-full lg:max-w-[530px]">
                Besoin d'aide pour créer une belle tenue ? Poste ta garde-robe et fais appel à la communauté HiveLooks pour trouver les meilleurs conseils !
              </p>
              <Link to="/signup" className="inline-block px-4 sm:px-6 py-2 bg-hive-beige text-hive-black font-bold rounded-lg border-[1px] border-hive-black shadow-[0_3px_0_0_#111111] box-border hover:translate-y-[3px] hover:shadow-[0_1px_0_0_#111111] transition-all text-sm sm:text-base">
                Essaie maintenant !
              </Link>
            </div>

            <div className="w-full max-w-[600px] aspect-square">
              <img
                src={heroImage}
                alt="Illustration d'accueil HiveLooks"
                className="w-full h-full object-cover rounded-[32px] border-[2px] border-hive-black"
              />
            </div>
          </div>
        </section>

        <section className="w-screen h-10 sm:h-12 md:h-[64px] overflow-hidden border-t-2 border-b-2 border-hive-black bg-hive-beige -mx-[50vw] left-[50%] relative" aria-label="Bannière défilante" role="marquee">
          <div className="scroll-banner flex items-center h-full animate-scroll whitespace-nowrap" aria-hidden="true">
            {[...Array(2)].map((_, loopIndex) => (
              <div key={loopIndex} className="flex items-center h-full">
                {[...Array(10)].map((_, index) => (
                  <div key={`${loopIndex}-${index}`} className="flex items-center gap-4 sm:gap-6 md:gap-8 min-w-max h-full">
                    <img src={HeaderLogo} alt="HiveLooks Logo" className="w-6 h-6 sm:w-8 sm:h-8 md:w-[32px] md:h-[32px]" />
                    <span className="text-base sm:text-xl md:text-[24px] font-piepie uppercase tracking-[0.05em]">HiveLooks</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Section Texte */}
        <section className="min-h-screen flex items-center justify-center max-w-[1400px] container mx-auto px-4" aria-label="Section d'explication">
          <h2 className="font-piepie text-center tracking-[0.05em] flex flex-col items-center space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 w-full overflow-hidden">
            <span className="whitespace-nowrap text-[clamp(1.5rem,5vw,7rem)] text-hive-black tracking-[0.05em] relative z-10 text-center slide-up">ON VOUS EXPLIQUE</span>
            <span className="whitespace-nowrap text-[clamp(2rem,8vw,13rem)] text-hive-black tracking-[0.05em] relative z-10 text-center slide-up">COMMENT</span>
            <span className="whitespace-nowrap text-[clamp(1.5rem,5vw,7rem)] text-hive-black tracking-[0.05em] relative z-10 text-center slide-up">ÇA FONCTIONNE EN</span>
            <span className="relative inline-block slide-up whitespace-nowrap">
              <span className="text-[clamp(2rem,7vw,10rem)] text-hive-black tracking-[0.05em] [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-[2px] sm:top-[3px] z-0 left-0 right-0">TROIS ÉTAPES</span>
              <span className="text-[clamp(2rem,7vw,10rem)] text-hive-beige tracking-[0.05em] [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">TROIS ÉTAPES</span>
            </span>
            <span className="whitespace-nowrap text-[clamp(1.5rem,6vw,8rem)] text-hive-black tracking-[0.05em] relative z-10 text-center slide-up">SUPER SIMPLES !</span>
          </h2>
        </section>

        {/* Section étape 1 */}
        <section className="min-h-screen max-w-[1400px] container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-12">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-piepie relative inline-block">
              <span className="text-hive-black tracking-[0.05em] [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-[2px] z-0">#1</span>
              <span className="text-hive-orange tracking-[0.05em] relative z-10">#1</span>
            </span>
            <div className="flex flex-col gap-2 sm:gap-3">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-piepie tracking-[0.05em] uppercase">ajoute ta garde-robe</h3>
              <p className="text-sm sm:text-base lg:text-[16px] text-[#111111] max-w-full sm:max-w-[480px]">
                Prends en photo tes vêtements, range-les dans ton dressing virtuel.
              </p>
            </div>
          </div>

          <div className="flex-grow flex mt-12 sm:mt-24 justify-center overflow-hidden">
            <div className="w-[80%] sm:w-[90%] h-2 sm:h-[16px] bg-hive-black rounded-full relative">
              <img src={pullBleu} alt="Pull bleu" className="hanging-rectangle w-[100px] sm:w-[150px] md:w-[200px] h-[100px] sm:h-[150px] md:h-[200px] max-w-none object-cover" />
              <img src={pullBleu} alt="Pull bleu" className="hanging-rectangle w-[100px] sm:w-[150px] md:w-[200px] h-[100px] sm:h-[150px] md:h-[200px] max-w-none object-cover" />
              <img src={pullBleu} alt="Pull bleu" className="hanging-rectangle w-[100px] sm:w-[150px] md:w-[200px] h-[100px] sm:h-[150px] md:h-[200px] max-w-none object-cover" />
            </div>
          </div>
        </section>

        {/* Section étape 2 */}
        <section className="min-h-screen flex flex-col max-w-[1400px] container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-end w-full">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 w-full justify-end">
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-piepie relative inline-block">
                <span className="text-hive-black tracking-[0.05em] [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-[2px] z-0">#2</span>
                <span className="text-hive-pink tracking-[0.05em] relative z-10">#2</span>
              </span>
              <div className="flex flex-col gap-2 sm:gap-3 items-end text-right">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-piepie tracking-[0.05em] uppercase">demande de l'aide</h3>
                <p className="text-sm sm:text-base lg:text-[16px] text-[#111111] max-w-full sm:max-w-[480px]">Publie un post avec ta problématique de look.</p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row w-full gap-8 mt-12 items-center justify-between">
              <div className="w-full lg:w-1/2 flex justify-center">
                <img
                  src={abeilleEtape2}
                  alt="Illustration d'une abeille stylisée"
                  className="w-full max-w-[500px] max-h-[50vh] object-contain floating-bee"
                />
              </div>
              <div className="w-full lg:w-1/2 flex justify-center relative">
                <img
                  src={BulleTexte}
                  alt="Bulle de dialogue"
                  className="w-full max-w-[500px] max-h-[50vh] object-contain"
                />
                <div className="absolute top-[37%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="font-piepie text-3xl sm:text-4xl lg:text-5xl text-hive-black typewriter-optimized">A l'aide !</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section étape 3 */}
        <section className="min-h-screen flex flex-col max-w-[1400px] container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 w-full">
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-piepie relative inline-block">
                <span className="text-hive-black tracking-[0.05em] [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-[2px] z-0">#3</span>
                <span className="text-hive-purple tracking-[0.05em] relative z-10">#3</span>
              </span>
              <div className="flex flex-col gap-2 sm:gap-3">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-piepie tracking-[0.05em] uppercase">reçois des conseils</h3>
                <p className="text-sm sm:text-base lg:text-[16px] text-[#111111] max-w-full sm:max-w-[480px]">Les membres de la communauté viennent t'aider avec des idées de tenues.</p>
              </div>
            </div>
            <StepThreeAnimation />
          </div>
        </section>

        {/* Section Exemple de Post */}
        <section className="min-h-screen flex flex-col items-center max-w-[1400px] container mx-auto">
          <h2 className="font-piepie text-center tracking-[0.05em] text-3xl sm:text-4xl md:text-5xl lg:text-[64px] mb-8 relative inline-block w-full">
            <span className="text-hive-black [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-[4px] sm:top-[6px] z-0">EXEMPLE D'UN POST</span>
            <span className="text-hive-beige [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">EXEMPLE D'UN POST</span>
          </h2>
          <div className="w-full max-w-[970px] mx-auto bg-white rounded-[32px] border-[2px] border-hive-black p-6 sm:p-8 shadow-[8px_8px_0_0_#FFAF02,_8px_8px_0_2px_#111111] h-[700px] overflow-x-hidden">
            <div className="flex flex-col lg:flex-row w-full gap-8 h-full overflow-x-hidden">
              <div className="w-full lg:w-1/2 overflow-y-auto scrollbar-thin scrollbar-track-transparent">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-hive-orange border-2 border-hive-black"></div>
                  <span className="text-lg font-piepie">@marie_fashion</span>
                </div>
                <h3 className="text-xl font-satoshi mb-4">Besoin d'aide pour styler un blazer</h3>
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-gray-600 cursor-pointer">
                    <span className="text-base">Afficher moins</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 transform transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-700">Help ! J'ai ce super blazer orange mais je ne sais pas comment le porter pour une soirée décontractée 🧡 Des idées ?</p>
                    <span className="inline-block mt-2 text-sm text-gray-600 font-satoshi">#vintage</span>
                  </div>
                </div>
                <div className="w-full">
                  <img
                    src={heroImage}
                    alt="Blazer vue de face"
                    className="w-full aspect-square object-cover rounded-lg border-2 border-hive-black"
                  />
                </div>
              </div>

              <div className="w-full lg:w-1/2 flex flex-col h-full">
                <div className="flex-grow overflow-y-auto">
                  {/* Commentaire 1 */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-hive-pink border-2 border-hive-black"></div>
                        <span className="font-piepie">@style_expert</span>
                      </div>
                      <button className="flex items-center gap-1 text-gray-500" aria-label="Aimer le commentaire">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>12</span>
                      </button>
                    </div>
                    <p className="text-gray-700 ml-14">Un jean mom avec des baskets blanches et un t-shirt blanc basique. Le blazer sera la pièce statement ! 🔥</p>
                  </div>

                  {/* Commentaire 2 */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-hive-purple border-2 border-hive-black"></div>
                        <span className="font-piepie">@fashionista</span>
                      </div>
                      <button className="flex items-center gap-1 text-gray-500" aria-label="Aimer le commentaire">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>8</span>
                      </button>
                    </div>
                    <p className="text-gray-700 ml-14">Essaie avec une robe noire courte et des bottines ! Le contraste sera super stylé 👌</p>
                  </div>

                  {/* Commentaire 3 */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-hive-yellow border-2 border-hive-black"></div>
                        <span className="font-piepie">@trendy_bee</span>
                      </div>
                      <button className="flex items-center gap-1 text-gray-500" aria-label="Aimer le commentaire">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>5</span>
                      </button>
                    </div>
                    <p className="text-gray-700 ml-14">Pour une touche plus casual, associe-le avec un jean déchiré et un crop top noir. Ajoute des bijoux dorés pour upgrader la tenue ! ✨</p>
                  </div>
                </div>

                <form className="mt-auto relative">
                  <textarea
                    placeholder="Ajouter un commentaire..."
                    className="w-full p-3 border-2 border-hive-black rounded-xl resize-none shadow-[0_3px_0_0_#111111] focus:outline-none focus:border-hive-black focus:bg-hive-yellow"
                    rows={3}
                  />
                  <button
                    type="submit"
                    className="absolute bottom-3 right-3 p-2 text-hive-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Section Infos et Valeurs */}
        <section className="min-h-screen flex flex-col items-center max-w-[1400px] container mx-auto">
          <div className="flex flex-col lg:flex-row justify-between w-full gap-8 lg:gap-16 items-stretch">
            {/* Colonne de gauche - Texte */}
            <div className="flex flex-col gap-8 lg:max-w-[530px] lg:flex-1">
              <p className="text-base sm:text-lg lg:text-[20px] text-hive-black leading-relaxed">
                Chez HiveLooks, l'idée est simple : on ne reste pas seul devant son miroir. Ici, chacun peut demander conseil ou en donner. Que tu sois expert·e en mode ou simplement enthousiaste, ton regard compte. Ensemble, on transforme le doute en style.
              </p>
              <p className="text-base sm:text-lg lg:text-[20px] text-hive-black leading-relaxed">
                Peu importe ton style, ton âge, ton corps ou ton expérience : tu es le·la bienvenu·e. HiveLooks croit en la diversité des goûts et des cultures. On s'enrichit des autres, on s'inspire mutuellement, et on découvre de nouvelles façons de s'exprimer à travers ses vêtements.
              </p>
            </div>

            {/* Colonne de droite - Valeurs */}
            <div className="flex flex-col gap-8 lg:max-w-[530px] lg:flex-1">
              <div className="flex flex-col gap-6">
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-satoshi font-bold text-hive-orange">
                  ENTRAIDE
                </span>
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-satoshi font-bold text-hive-pink">
                  CRÉATIVITÉ
                </span>
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-satoshi font-bold text-hive-purple">
                  OUVERTURE
                </span>
              </div>
              <p className="text-base sm:text-lg lg:text-[20px] text-hive-black leading-relaxed text-center lg:text-left">
                Les idées fusent, les combinaisons surprennent. Ici, on s'amuse avec les styles, on mixe les genres, on teste des trucs improbables… et parfois, ça marche super bien ! La mode, c'est un terrain de jeu collectif : libre à toi d'y ajouter ta touche perso.
              </p>
            </div>
          </div>
          <p className="text-base sm:text-lg lg:text-[3rem] text-hive-black font-piepie max-w-[1200px] text-center leading-[1.4] sm:leading-[1.5] mt-16 lg:mt-[6rem]">
          HIVELOOKS, C'EST UNE COMMUNAUTÉ OÙ L'ON <span className="relative inline-block">
            <span className="text-hive-black [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-[4px] sm:top-[6px] z-0">PARTAGE</span><span className="text-hive-beige [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">PARTAGE</span></span>, OÙ L'ON <span className="relative inline-block"><span className="text-hive-black [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-[4px] sm:top-[6px] z-0">APPREND</span><span className="text-hive-beige [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">APPREND</span></span>, ET OÙ L'ON <span className="relative inline-block"><span className="text-hive-black [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-[4px] sm:top-[6px] z-0">S'INSPIRE</span><span className="text-hive-beige [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">S'INSPIRE</span></span>.
          </p>
        </section>
      </main>

      <div className="min-h-screen flex items-center justify-center max-w-[1400px] container mx-auto px-4 sm:px-6 lg:px-8" id="cta-section">
        <div className="w-full max-w-[800px] bg-white rounded-[32px] border-[2px] h-[400px] border-hive-black p-8 sm:p-12 shadow-[8px_8px_0_0_#FFAF20,_8px_8px_0_2px_#111111] text-center relative flex flex-col justify-between">
          <h2 className="text-[1.5rem] text-hive-black font-piepie uppercase max-w-[500px] mx-auto">Prêt(e) à créer tes looks avec l'aide des autres ?</h2>
          <div className="relative">
            <div className="flex justify-center gap-4 sm:gap-8 group relative">
              <Link to="/signup" className="inline-block px-6 py-4 bg-hive-pink text-[1rem] rounded-lg border-[2px] border-hive-black shadow-[0_4px_0_0_#111111] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 hover:floating-ball-left">
                Créer mon dressing
              </Link>
              <Link to="/discover" className="inline-block px-6 py-4 bg-hive-purple text-[1rem] rounded-lg border-[2px] border-hive-black shadow-[0_4px_0_0_#111111] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 hover:floating-ball-right">
                Découvrir des looks
              </Link>
              <img src={selectAbeille1} alt="Abeille décorative" className="absolute w-16 h-16 transform -translate-x-1/2 cta-bee" style={{ left: '50%', top: '-7rem' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;