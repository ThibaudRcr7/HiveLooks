import { FC, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import BulleTexte from '../assets/images/illustrations/bulle-texte-2.svg';
import heroImage from '../assets/images/photos/escalier-outfit.webp';

const StepThreeAnimation: FC = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Animations verticales des bulles
  const yFirstBubble = useTransform(scrollYProgress, [0, 0.3], ['100vh', '0vh']);
  const ySecondBubble = useTransform(scrollYProgress, [0.1, 0.4], ['100vh', '0vh']);
  const yThirdBubble = useTransform(scrollYProgress, [0.2, 0.5], ['100vh', '0vh']);

  const opacityFirstBubble = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const opacitySecondBubble = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const opacityThirdBubble = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* Image centrale */}
      <div className="relative z-10 w-full max-w-[400px] mx-auto pointer-events-none">
        <div className="aspect-[3/4] overflow-hidden rounded-3xl border-2 border-hive-black shadow-lg">
          <img
            src={heroImage}
            alt="Illustration centrale"
            className="w-full h-full object-cover"
          />
        </div>
      </div>


      {/* Bulle 1 – haut à droite */}
      <motion.div
        className="absolute z-20 w-[200px] sm:w-[230px] md:w-[260px] translate-x-1/2 -translate-y-1/2 top-[15%] right-[5%] sm:right-[25%]"
        style={{
          y: yFirstBubble,
          opacity: opacityFirstBubble,
        }}
        transition={{ ease: [0.25, 0.1, 0.25, 1], duration: 0.6 }}
      >
        <img src={BulleTexte} alt="Bulle 1" className="w-full h-auto" />
      </motion.div>

      {/* Bulle 2 – centre gauche */}
      <motion.div
        className="absolute z-30 w-[200px] sm:w-[230px] md:w-[260px] -translate-x-1/2 -translate-y-1/2 top-[50%] left-[1%] sm:left-[25%]"
        style={{
          y: ySecondBubble,
          opacity: opacitySecondBubble,
        }}
        transition={{ ease: [0.25, 0.1, 0.25, 1], duration: 0.6 }}
      >
        <img src={BulleTexte} alt="Bulle de dialogue 2" className="w-full h-auto -scale-x-100" />
      </motion.div>

      {/* Bulle 3 – bas à droite */}
      <motion.div
        className="absolute z-20 w-[200px] sm:w-[230px] md:w-[260px] translate-x-1/2 -translate-y-1/2 top-[75%] right-[10%] sm:right-[30%]"
        style={{
          y: yThirdBubble,
          opacity: opacityThirdBubble,
        }}
        transition={{ ease: [0.25, 0.1, 0.25, 1], duration: 0.6 }}
      >
        <img src={BulleTexte} alt="Bulle 3" className="w-full h-auto" />
      </motion.div>
    </div>
  );
};

export default StepThreeAnimation;
