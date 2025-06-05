import { FC } from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline';
  className?: string;
}

const Avatar: FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  status,
  className = ''
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-hive-black/40'
  };

  return (
    <div className="relative inline-block">
      <div
        className={`
          ${sizes[size]}
          rounded-full
          border-2
          border-hive-black
          overflow-hidden
          ${className}
        `}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-hive-orange flex items-center justify-center text-hive-black font-bold">
            {alt.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      {status && (
        <div
          className={`
            absolute
            -top-1
            -right-1
            w-3
            h-3
            rounded-full
            border
            border-hive-black
            ${statusColors[status]}
          `}
        />
      )}
    </div>
  );
};

export default Avatar;