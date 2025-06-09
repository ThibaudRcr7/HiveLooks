import { FC, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'framer-motion';
import HeaderLogo from '../assets/images/logos/Header-logo.svg';
import TypewriterText from '../components/TypewriterText';
import PierreEnd from '../assets/images/photos/Pierre-end.webp';
import SelectAbeille1 from '../assets/images/illustrations/select-abeille-1.png';
import CardiganPhoto from '../assets/images/photos/cardigan-photo.webp';
import PierreBasic from '../assets/images/photos/Pierre-basic.webp';
import PierreBasic2 from '../assets/images/photos/Pierre-basic-2.webp';

const PresentationPage: FC = () => {
  const sectionRef = useRef(null);
  const secondSectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [isFirstImageFront, setIsFirstImageFront] = useState(true);

  const { scrollYProgress } = useScroll({
    target: secondSectionRef,
    offset: ["start end", "end start"]
  });

  const springConfig = { stiffness: 100, damping: 30, bounce: 0 };
  const springProgress = useSpring(scrollYProgress, springConfig);

  const imageRotate = useTransform(springProgress, [0, 1], [0, 5]);
  const imageScale = useTransform(springProgress, [0, 0.5, 1], [1, 1.1, 1]);
  const textOpacity = useTransform(springProgress, [0, 0.2], [0, 1]);
  const textY = useTransform(springProgress, [0, 0.2], [50, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const handleImageClick = () => {
    setIsFirstImageFront(!isFirstImageFront);
  };

  return (
    <div className="min-h-screen bg-hive-pale relative">
      {/* Première section */}
      <section 
        ref={sectionRef}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16"
        >
          {/* Colonne de texte */}
          <motion.div 
            variants={itemVariants}
            className="w-full lg:w-1/2 space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-piepie tracking-wider">
              <span className="relative inline-block">
                <span className="text-hive-black [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-1 z-0">UNE HISTOIRE</span>
                <span className="text-hive-pale [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">UNE HISTOIRE</span>
              </span>
              <br />
              <span className="text-hive-black">DE STYLE</span>
            </h2>
            
            <p className="text-lg md:text-xl text-hive-black leading-relaxed">
              Pierre vient d’acheter un cardigan Lacoste pour seulement 12 euros en friperie. Il adore la couleur et la coupe, et il est très content de son achat.
            </p>
          </motion.div>

          {/* Colonne image */}
          <motion.div 
            variants={itemVariants}
            className="w-full lg:w-1/2"
          >
            <motion.div
              whileHover={{ 
                scale: 1.05,
                rotate: 2,
                transition: { duration: 0.3 }
              }}
              className="relative"
            >
              <div className="aspect-square w-full max-w-[500px] mx-auto bg-white rounded-3xl border-2 border-hive-black overflow-hidden shadow-[8px_8px_0_0_#FFAF02,_8px_8px_0_2px_#111111]">
                <img
                  src={CardiganPhoto}
                  alt="Cardigan Lacoste vintage"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Deuxième section */}
      <section 
        ref={secondSectionRef}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 rounded-b-3xl relative"
      >
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16"
        >
          {/* Colonne images */}
          <div className="w-full lg:w-1/2 relative h-[600px] cursor-pointer" onClick={handleImageClick}>
            <motion.div
              style={{ rotate: imageRotate, scale: imageScale }}
              className="absolute inset-0"
              animate={{
                zIndex: isFirstImageFront ? 10 : 0,
                x: isFirstImageFront ? 0 : -20,
                y: isFirstImageFront ? 0 : 20,
                rotate: isFirstImageFront ? 0 : -5,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="aspect-[3/4] w-full max-w-[400px] mx-auto bg-white rounded-3xl border-2 border-hive-black overflow-hidden shadow-[8px_8px_0_0_#FF5FA2,_8px_8px_0_2px_#111111]">
                <img
                  src={PierreBasic}
                  alt="Photo de la tenue de base de Pierre"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <motion.div
              className="absolute inset-0"
              animate={{
                zIndex: isFirstImageFront ? 0 : 10,
                x: isFirstImageFront ? -20 : 0,
                y: isFirstImageFront ? 20 : 0,
                rotate: isFirstImageFront ? -5 : 0,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="aspect-[3/4] w-full max-w-[400px] mx-auto bg-white rounded-3xl border-2 border-hive-black overflow-hidden shadow-[8px_8px_0_0_#A259FF,_8px_8px_0_2px_#111111]">
                <img
                  src={PierreBasic2}
                  alt="Photo de vêtements"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* Colonne texte */}
          <motion.div 
            variants={itemVariants}
            className="w-full lg:w-1/2 space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-piepie tracking-wider">
              <span className="relative inline-block">
                <span className="text-hive-black [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-1 z-0">LA FRUSTRATION</span>
                <span className="text-hive-pale [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">LA FRUSTRATION</span>
              </span>
            </h2>
            <p className="text-lg md:text-xl text-hive-black leading-relaxed bg-hive-white rounded-xl px-4 py-3 border border-hive-black w-full max-w-[532px] mx-auto lg:mx-0">
              Mais après avoir retourné sa garde-robe dans tous les sens, rien n’y fait : impossible de créer une tenue qui lui plaît. Frustré, il demande à son ami s’il n’aurait pas une solution.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Troisième section : Découverte de HiveLooks */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col items-center justify-center bg-hive-pale relative overflow-hidden">
        {/* Logo animé + halo flou centré */}
        <div className="z-10 mb-10 flex items-center justify-center">
          <div className="relative w-40 h-40 flex items-center justify-center z-10">
            {/* Halo flou centré parfaitement derrière */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 0.5, scale: 1.3 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full rounded-full bg-hive-yellow blur-3xl z-0 pointer-events-none"
              aria-hidden="true"
            />
            {/* Logo HiveLooks par-dessus, sans cadre ni shimmer */}
            <motion.img
              initial={{ scale: 0.7, rotate: -30 }}
              whileInView={{ scale: 1.1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, duration: 1.1, delay: 0.1 }}
              viewport={{ once: true, amount: 0.5 }}
              src={HeaderLogo}
              alt="Logo HiveLooks"
              className="w-full h-full relative z-10 select-none"
              draggable={false}
            />
          </div>
        </div>
        {/* Texte narratif animé */}
        <motion.p
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.77, 0, 0.18, 1], delay: 0.2 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center text-lg md:text-2xl text-hive-black font-bold max-w-2xl mx-auto border-2 border-hive-black rounded-xl px-6 py-6 z-10"
        >
          Son ami lui fait donc découvrir <span className="text-hive-orange font-bold">HiveLooks</span>, un site d’entraide vestimentaire qui semble parfaitement répondre à ses besoins. Pierre tente l’expérience, suit les conseils de son ami, et publie son tout premier post.
        </motion.p>
      </section>

      {/* Quatrième section : Résultat final */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col lg:flex-row items-center gap-12 md:gap-20 rounded-t-3xl relative overflow-visible">
        {/* Image stylisée avec reveal dynamique */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.77, 0, 0.18, 1] }}
          viewport={{ once: true, amount: 0.2 }}
          className="w-full max-w-[400px] aspect-[3/4] bg-white rounded-3xl border-2 border-hive-black overflow-hidden shadow-[8px_8px_0_0_#F57200,_8px_8px_0_2px_#111111] flex-shrink-0 flex items-center justify-center"
        >
          <img
            src={PierreEnd}
            alt="Pierre et sa tenue finale, photo stylisée"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </motion.div>
        {/* Colonne texte avec label et effet typewriter */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-6 relative">
          {/* Titre stylisé */}
          <motion.h3
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 80 }}
            viewport={{ once: true, amount: 0.6 }}
            className="font-piepie text-3xl md:text-4xl lg:text-5xl text-hive-black mb-2 relative inline-block"
          >
            <span className="relative inline-block">
              <span className="text-hive-black [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-1 left-0 right-0 z-0">Le résultat...</span>
              <span className="text-hive-orange [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">Le résultat...</span>
            </span>
          </motion.h3>
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7, type: 'spring', stiffness: 80 }}
            viewport={{ once: true, amount: 0.6 }}
            className="flex items-center gap-2 mb-2"
          >
            <img src={SelectAbeille1} alt="Abeille de sélection" className="w-8 h-8" />
            <span className="font-piepie text-hive-black text-lg">Look validé par la communauté !</span>
          </motion.div>
          {/* Paragraphe storytelling avec effet typewriter */}
          <TypewriterText
            text="Grâce à la communauté, Pierre reçoit de nombreuses suggestions et parvient enfin à créer une tenue qu’il adore sans même avoir eu besoin d’acheter de nouveaux vêtements. Pour remercier tout le monde, il partage fièrement son look final… et il compte bien revenir sur HiveLooks."
            className="text-lg md:text-2xl text-hive-black font-bold max-w-xl border-2 border-hive-black rounded-xl px-6 py-6 bg-hive-white"
          />
        </div>
      </section>
    </div>
  );
};

export default PresentationPage; 