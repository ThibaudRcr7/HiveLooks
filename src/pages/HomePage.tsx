import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTypewriterAnimation } from '../hooks/useTypewriterAnimation';
import HeaderLogo from '../assets/images/logos/Header-logo.svg';
import '../assets/styles/animations.css';
import { useAnimations } from '../hooks/useAnimations';
import heroImage from '../assets/images/hero-image.jpg';
import exempleOutfit from '../assets/images/photos/exemple-outfit.webp';
import pullBleu from '../assets/images/photos/Pull-bleu.png';
import BulleTexte from '../assets/images/illustrations/Bulle-texte.svg';
import abeilleEtape2 from '../assets/images/illustrations/abeille-etape2.png';
import StepThreeAnimation from '../components/StepThreeAnimation';
import FloatingBee from '../components/FloatingBee';

const HomePage: FC = () => {
  useAnimations();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { displayText, elementRef } = useTypewriterAnimation("A l'aide!", 50);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const valueElements = document.querySelectorAll('.value-unfold');
    valueElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      valueElements.forEach(element => observer.unobserve(element));
    };
  }, []);

  const handleTryNowClick = () => {
    if (currentUser) {
      navigate('/profile');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div>
      <main className="bg-hive-pale overflow-x-hidden flex flex-col space-y-32 md:space-y-48" role="main">
        <section className="min-h-screen flex items-center container mx-auto" aria-label="Section principale">
          <div className="flex flex-col lg:flex-row justify-between items-center relative z-10 w-full gap-8 lg:gap-16">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-piepie leading-tight w-full lg:max-w-[800px] flex flex-col tracking-[0.05em] relative mb-8">
                <span className="relative inline-block">
                  <span className="text-hive-black [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-1 z-0">BIENVENUE</span>
                  <span className="text-hive-pale [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">BIENVENUE</span>
                </span>
                <span>DANS LA RUCHE !</span>
              </h1>
              <p className="text-lg md:text-xl text-hive-black leading-relaxed max-w-[530px] mb-8">
                Besoin d'aide pour créer une belle tenue ? Poste ta garde-robe et fais appel à la communauté HiveLooks pour trouver les meilleurs conseils !
              </p>
              <button
                onClick={handleTryNowClick}
                className="inline-block px-6 py-3 bg-hive-pale text-hive-black font-bold text-base md:text-lg rounded-lg border border-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none transition-all duration-200"
              >
                Essaie maintenant !
              </button>
            </div>

            <div className="w-full max-w-[600px] aspect-square lg:flex-shrink-0">
              <img
                src={heroImage}
                alt="Illustration d'accueil HiveLooks"
                className="w-full h-full object-cover rounded-3xl border-2 border-hive-black shadow-lg"
                loading="eager"
              />
            </div>
          </div>
        </section>

        <section className="w-screen h-16 md:h-20 overflow-hidden border-t-2 border-b-2 border-hive-black bg-hive-pale -mx-[50vw] left-[50%] relative" aria-label="Bannière défilante" role="marquee">
          <div className="scroll-banner flex items-center h-full animate-scroll whitespace-nowrap" aria-hidden="true">
            {[...Array(2)].map((_, loopIndex) => (
              <div key={loopIndex} className="flex items-center h-full">
                {[...Array(10)].map((_, index) => (
                  <div key={`${loopIndex}-${index}`} className="flex items-center gap-6 md:gap-8 min-w-max h-full px-4">
                    <img src={HeaderLogo} alt="HiveLooks Logo" className="w-8 h-8 md:w-10 md:h-10" />
                    <span className="text-xl md:text-2xl font-piepie uppercase tracking-wider">HiveLooks</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Section Texte */}
        <section className="min-h-screen flex items-center justify-center container mx-auto" aria-label="Section d'explication">
          <h2 className="font-piepie text-center tracking-wider flex flex-col items-center space-y-8 md:space-y-12 lg:space-y-16 w-full overflow-hidden px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto">
            <span className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl text-hive-black relative z-10 text-center slide-up whitespace-nowrap inline-block w-full max-w-full overflow-hidden leading-tight">ON VOUS EXPLIQUE</span>
            <span className="text-6xl sm:text-7xl lg:text-9xl xl:text-[10rem] text-hive-black relative z-10 text-center slide-up whitespace-nowrap inline-block w-full max-w-full overflow-hidden leading-none">COMMENT</span>
            <span className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl text-hive-black relative z-10 text-center slide-up whitespace-nowrap inline-block w-full max-w-full overflow-hidden leading-tight">ÇA FONCTIONNE EN</span>
            <span className="relative inline-block slide-up w-full max-w-full overflow-hidden">
              <span className="text-5xl sm:text-6xl lg:text-8xl xl:text-9xl text-hive-black [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-1 z-0 left-0 right-0 whitespace-nowrap text-center leading-none">TROIS ÉTAPES</span>
              <span className="text-5xl sm:text-6xl lg:text-8xl xl:text-9xl text-hive-pale [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10 whitespace-nowrap text-center leading-none">TROIS ÉTAPES</span>
            </span>
            <span className="text-4xl sm:text-6xl lg:text-8xl xl:text-9xl text-hive-black relative z-10 text-center slide-up whitespace-nowrap inline-block w-full max-w-full overflow-hidden leading-none">SUPER SIMPLES !</span>
          </h2>
        </section>

        {/* Section étape 1 */}
        <section className="min-h-screen container mx-auto flex flex-col justify-between py-16 md:py-24">
          <div className="flex flex-col sm:flex-row items-start gap-6 md:gap-8">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-piepie relative inline-block shrink-0">
              <span className="text-hive-black tracking-wider [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-1 z-0">#1</span>
              <span className="text-hive-orange tracking-wider relative z-10">#1</span>
            </span>
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-piepie tracking-wider uppercase">ajoute ta garde-robe</h3>
              <p className="text-lg md:text-xl text-hive-black leading-relaxed max-w-[480px]">
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
        <section className="min-h-screen container mx-auto flex flex-col py-16 md:py-24">
          <div className="flex flex-col sm:flex-row items-start gap-6 md:gap-8 justify-end">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-piepie relative inline-block shrink-0">
              <span className="text-hive-black tracking-wider [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-1 z-0">#2</span>
              <span className="text-hive-pink tracking-wider relative z-10">#2</span>
            </span>
            <div className="flex flex-col gap-4 items-end text-right">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-piepie tracking-wider uppercase">demande de l'aide</h3>
              <p className="text-lg md:text-xl text-hive-black leading-relaxed max-w-[480px]">Publie un post avec ta problématique de look.</p>
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
                  <span 
                    ref={elementRef}
                    className="font-piepie text-3xl sm:text-4xl lg:text-5xl text-hive-black"
                  >
                    {displayText}
                  </span>
                </div>
              </div>
            </div>
        </section>

        {/* Section étape 3 */}
        <section className="min-h-screen container mx-auto flex flex-col py-16 md:py-24">
          <div className="flex flex-col sm:flex-row items-start gap-6 md:gap-8">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-piepie relative inline-block shrink-0">
              <span className="text-hive-black tracking-wider [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-1 z-0">#3</span>
              <span className="text-hive-purple tracking-wider relative z-10">#3</span>
            </span>
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-piepie tracking-wider uppercase">reçois des conseils</h3>
              <p className="text-lg md:text-xl text-hive-black leading-relaxed max-w-[480px]">Les membres de la communauté viennent t'aider avec des idées de tenues.</p>
            </div>
          </div>
          <StepThreeAnimation />
        </section>

        {/* Section Exemple de Post */}
        <section className="min-h-screen container mx-auto flex flex-col items-center py-16 md:py-24">
          <h2 className="font-piepie text-center tracking-wider text-4xl sm:text-5xl lg:text-6xl mb-12 relative inline-block">
            <span className="text-hive-black [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-1 z-0">EXEMPLE D'UN POST</span>
            <span className="text-hive-pale [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">EXEMPLE D'UN POST</span>
          </h2>
          <div className="w-full max-w-[970px] mx-auto bg-white rounded-3xl border-2 border-hive-black p-8 md:p-10 shadow-[8px_8px_0_0_#FFAF02,_8px_8px_0_2px_#111111] h-[700px] overflow-x-hidden">
            <div className="flex flex-col lg:flex-row w-full gap-8 lg:gap-12 h-full overflow-x-hidden">
              {/* Colonne de gauche - Post */}
              <div className="w-full lg:w-1/2 overflow-y-auto scrollbar-thin scrollbar-track-transparent">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-hive-orange border-2 border-hive-black"></div>
                    <span className="font-piepie">@marie_fashion</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 text-hive-black/60 cursor-pointer">
                    <span className="text-base">Afficher plus</span>
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
                    <p className="text-hive-black/80">Help ! J'ai ce super blazer orange mais je ne sais pas comment le porter pour une soirée décontractée 🧡 Des idées ?</p>
                    <span className="inline-block mt-2 text-sm text-hive-black/60 font-satoshi">#vintage</span>
                  </div>
                </div>

                <div className="w-full">
                  <img
                    src={exempleOutfit}
                    alt="Exemple outfit"
                    className="w-full aspect-square object-cover rounded-lg border-2 border-hive-black"
                  />
                </div>
              </div>

              {/* Colonne de droite - Commentaires */}
              <div className="w-full lg:w-1/2 flex flex-col h-full">
                <div className="flex-grow overflow-y-auto">
                  {/* Commentaire 1 */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-hive-pink border-2 border-hive-black"></div>
                        <span className="font-piepie">@style_expert</span>
                      </div>
                      <button className="flex items-center gap-1">
                         <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-hive-black/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                         </svg>
                         <span className="text-hive-black/50">12</span>
                       </button>
                    </div>
                    <p className="text-hive-black/80 ml-14">Un jean mom avec des baskets blanches et un t-shirt blanc basique. Le blazer sera la pièce statement ! 🔥</p>
                  </div>

                  {/* Commentaire 2 */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-hive-purple border-2 border-hive-black"></div>
                        <span className="font-piepie">@fashionista</span>
                      </div>
                      <button className="flex items-center gap-1">
                         <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-hive-black/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                         </svg>
                         <span className="text-hive-black/50">8</span>
                       </button>
                    </div>
                    <p className="text-hive-black/80 ml-14">Essaie avec une robe noire courte et des bottines ! Le contraste sera super stylé 👌</p>
                  </div>

                  {/* Commentaire 3 */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-hive-yellow border-2 border-hive-black"></div>
                        <span className="font-piepie">@trendy_bee</span>
                      </div>
                      <button className="flex items-center gap-1">
                         <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-hive-black/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                         </svg>
                         <span className="text-hive-black/50">5</span>
                       </button>
                    </div>
                    <p className="text-hive-black/80 ml-14">Pour une touche plus casual, associe-le avec un jean déchiré et un crop top noir. Ajoute des bijoux dorés pour upgrader la tenue ! ✨</p>
                  </div>
                </div>

                {/* Formulaire de commentaire */}
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
        <section className="min-h-screen container mx-auto flex flex-col items-center py-16 md:py-24">
          <div className="flex flex-col lg:flex-row justify-between w-full gap-12 lg:gap-20 items-stretch">
            {/* Colonne de gauche - Texte */}
            <div className="flex flex-col gap-16 lg:max-w-[530px] lg:flex-1">
              <div className="space-y-8">
                <p className="text-lg md:text-xl text-hive-black leading-relaxed">
                  Chez HiveLooks, l'idée est simple : on ne reste pas seul devant son miroir. Ici, chacun peut demander conseil ou en donner. Que tu sois expert·e en mode ou simplement enthousiaste, ton regard compte. Ensemble, on transforme le doute en style.
                </p>
                <p className="text-lg md:text-xl text-hive-black leading-relaxed">
                  Peu importe ton style, ton âge, ton corps ou ton expérience : tu es le·la bienvenu·e. HiveLooks croit en la diversité des goûts et des cultures. On s'enrichit des autres, on s'inspire mutuellement, et on découvre de nouvelles façons de s'exprimer à travers ses vêtements.
                </p>
              </div>
              <p className="text-lg md:text-xl text-hive-black leading-relaxed">
                Les idées fusent, les combinaisons surprennent. Ici, on s'amuse avec les styles, on mixe les genres, on teste des trucs improbables… et parfois, ça marche super bien ! La mode, c'est un terrain de jeu collectif : libre à toi d'y ajouter ta touche perso.
              </p>
            </div>

            {/* Colonne de droite - Valeurs */}
            <div className="flex flex-col gap-16 lg:max-w-[530px] lg:flex-1 items-center lg:items-end h-full justify-center relative">
              <div className="flex flex-col gap-16 lg:gap-24 relative">
                <div className="value-unfold">
                  <span className="text-5xl sm:text-6xl lg:text-7xl font-piepie relative inline-block">
                    <span className="text-hive-black [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-1 z-0">ENTRAIDE</span>
                    <span className="text-hive-orange [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">ENTRAIDE</span>
                  </span>
                </div>
                <div className="value-unfold">
                  <span className="text-5xl sm:text-6xl lg:text-7xl font-piepie relative inline-block">
                    <span className="text-hive-black [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-1 z-0">CRÉATIVITÉ</span>
                    <span className="text-hive-pink [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">CRÉATIVITÉ</span>
                  </span>
                </div>
                <div className="value-unfold">
                  <span className="text-5xl sm:text-6xl lg:text-7xl font-piepie relative inline-block">
                    <span className="text-hive-black [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-1 z-0">OUVERTURE</span>
                    <span className="text-hive-purple [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">OUVERTURE</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-base sm:text-lg lg:text-[3rem] text-hive-black font-piepie max-w-[1200px] text-center leading-[1.4] sm:leading-[1.5] mt-16 lg:mt-[6rem]">
          HIVELOOKS, C'EST UNE COMMUNAUTÉ OÙ L'ON <span className="relative inline-block">
            <span className="text-hive-black [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-[4px] sm:top-[6px] z-0">PARTAGE</span><span className="text-hive-pale [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">PARTAGE</span></span>, OÙ L'ON <span className="relative inline-block"><span className="text-hive-black [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-[4px] sm:top-[6px] z-0">APPREND</span><span className="text-hive-pale [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">APPREND</span></span>, ET OÙ L'ON <span className="relative inline-block"><span className="text-hive-black [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-[4px] sm:top-[6px] z-0">S'INSPIRE</span><span className="text-hive-pale [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">S'INSPIRE</span></span>.
          </p>
        </section>
      </main>

      <div className="min-h-screen flex items-center justify-center max-w-[1400px] container mx-auto px-4 sm:px-6 lg:px-8" id="cta-section">
        <div className="w-full max-w-[800px] bg-white rounded-[32px] border-[2px] h-[400px] border-hive-black p-8 sm:p-12 shadow-[8px_8px_0_0_#FFAF20,_8px_8px_0_2px_#111111] text-center relative flex flex-col justify-between">
          <h2 className="text-[1.5rem] text-hive-black font-piepie uppercase max-w-[500px] mx-auto">Prêt(e) à créer tes looks avec l'aide des autres ?</h2>
          <FloatingBee />
        </div>
      </div>
    </div>
  );
};

export default HomePage;