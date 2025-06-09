import { FC } from 'react';
import { motion } from 'framer-motion';

const CreditsPage: FC = () => {
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

  return (
    <div className="min-h-screen bg-hive-pale py-16">
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-piepie text-center mb-16 relative"
        >
          <span className="text-hive-black [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-1 z-0">CRÉDITS</span>
          <span className="text-hive-pale [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">CRÉDITS</span>
        </motion.h1>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto space-y-8"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-[32px] border-[2px] border-hive-black shadow-[8px_8px_0_0_#FFAF02,_8px_8px_0_2px_#111111] p-8">
            <h2 className="text-2xl font-piepie mb-4">Outils utilisés</h2>
            <ul className="space-y-4">
              <li>
                <a 
                  href="https://www.cursor.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-hive-black hover:text-hive-yellow transition-colors duration-200 underline decoration-2 underline-offset-4"
                >
                  Cursor
                </a>
              </li>
              <li>
                <a 
                  href="https://chatgpt.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-hive-black hover:text-hive-yellow transition-colors duration-200 underline decoration-2 underline-offset-4"
                >
                  ChatGPT
                </a>
              </li>
              <li>
                <a 
                  href="https://phosphoricons.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-hive-black hover:text-hive-yellow transition-colors duration-200 underline decoration-2 underline-offset-4"
                >
                  Phosphor Icons
                </a>
              </li>
              <li>
                <a 
                  href="https://squoosh.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-hive-black hover:text-hive-yellow transition-colors duration-200 underline decoration-2 underline-offset-4"
                >
                  Squoosh
                </a>
              </li>
              <li>
                <a 
                  href="https://console.firebase.google.com/u/0/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-hive-black hover:text-hive-yellow transition-colors duration-200 underline decoration-2 underline-offset-4"
                >
                  Firebase
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-[32px] border-[2px] border-hive-black shadow-[8px_8px_0_0_#FF71A6,_8px_8px_0_2px_#111111] p-8">
            <h2 className="text-2xl font-piepie mb-4">Crédits photos</h2>
            <p className="text-hive-black">
              Les photos de la page présentation ont été réalisées par <span className="font-bold">Pierre.J</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreditsPage; 