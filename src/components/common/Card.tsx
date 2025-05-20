import { FC, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'hover' | 'interactive';
  className?: string;
}

const Card: FC<CardProps> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const baseStyles = 'bg-white rounded-[32px] border-[2px] border-hive-black';

  const variants = {
    default: 'shadow-[8px_8px_0_0_#FFAF02,_8px_8px_0_2px_#111111]',
    hover: 'shadow-[8px_8px_0_0_#FF71A6,_8px_8px_0_2px_#111111] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-transform duration-200',
    interactive: 'shadow-[8px_8px_0_0_#726CFF,_8px_8px_0_2px_#111111] hover:shadow-[4px_4px_0_0_#726CFF,_4px_4px_0_2px_#111111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200'
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      role="article"
    >
      {children}
    </div>
  );
};

export default Card;