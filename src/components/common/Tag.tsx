import { FC } from 'react';
import { Link } from 'react-router-dom';

interface TagProps {
  tag: string;
  variant?: 'post' | 'look';
  onClick?: () => void;
  className?: string;
  isSelected?: boolean;
}

const Tag: FC<TagProps> = ({
  tag,
  variant = 'post',
  onClick,
  className = '',
  isSelected = false
}) => {
  const baseStyles = 'px-3 py-1.5 text-sm font-bold rounded-lg transition-all duration-200';
  
  const defaultStyles = 'bg-white text-hive-black border border-hive-black/30 hover:bg-[#FFFDE3]';
  const selectedStyles = 'bg-hive-yellow text-hive-black border border-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none';

  const finalStyles = `${baseStyles} ${isSelected ? selectedStyles : defaultStyles} ${className}`;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={finalStyles}
      >
        {tag}
      </button>
    );
  }

  return (
    <Link
      to={`/discover?tag=${encodeURIComponent(tag)}`}
      className={finalStyles}
    >
      {tag}
    </Link>
  );
};

export default Tag;