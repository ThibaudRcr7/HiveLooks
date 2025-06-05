import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import selectAbeille1 from '../assets/images/illustrations/select-abeille-1.png';

interface FloatingBeeProps {
  className?: string;
}

const FloatingBee = ({ className = '' }: FloatingBeeProps) => {
  const [hoveredButton, setHoveredButton] = useState<'left' | 'right' | null>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Les positions X sont en pixels (approximativement centrées sur les boutons)
  const beePositions = {
    center: 0,
    left: -130,
    right: 130,
  };

  return (
    <div className="relative w-full flex justify-center">
      <div
        className="relative flex flex-col items-center"
        onMouseLeave={() => setHoveredButton(null)}
      >
        {/* Abeille flottante animée */}
        <motion.img
          src={selectAbeille1}
          alt="Abeille décorative"
          className={`w-16 h-16 absolute top-[-7.5rem] ${className}`}
          animate={{
            x: beePositions[hoveredButton || 'center'],
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />

        {/* Boutons */}
        <div className="flex gap-6">
          <a
            href="/signup"
            onClick={(e) => {
              e.preventDefault();
              navigate(currentUser ? '/profile' : '/signup');
            }}
            onMouseEnter={() => setHoveredButton('left')}
            className="inline-block px-6 py-4 bg-hive-pink text-[1rem] rounded-lg border-[2px] border-hive-black shadow-[0_4px_0_0_#111111] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
          >
            Créer mon dressing
          </a>

          <Link
            to="/discover"
            onMouseEnter={() => setHoveredButton('right')}
            className="inline-block px-6 py-4 bg-hive-purple text-[1rem] rounded-lg border-[2px] border-hive-black shadow-[0_4px_0_0_#111111] hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
          >
            Découvrir des looks
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FloatingBee;
