import { FC } from 'react';

interface ProfileCardProps {
  name: string;
  bio: string;
  imageSrc: string;
  onButtonClick?: () => Promise<void>;
  buttonText?: string;
  onEditClick?: () => void;
  showActions?: boolean;
}

const ProfileCard: FC<ProfileCardProps> = ({
  name,
  bio,
  imageSrc,
  onButtonClick,
  buttonText = 'Voir le profil',
  onEditClick,
  showActions = true
}) => {
  return (
    <div className="flex flex-col md:flex-row bg-[#FFFDE3] p-4 gap-4 w-full max-w-[800px]">
      <div className="flex justify-center md:justify-start">
        <img
          src={imageSrc}
          alt={`Photo de profil de ${name}`}
          className="w-[200px] h-[200px] object-cover rounded-[20px] border-2 border-black shadow-[4px_4px_0_#000000]"
        />
      </div>
      
      <div className="flex-grow bg-white rounded-[16px] border-2 border-hive-black shadow-[4px_4px_0_#111111] p-4 relative min-h-[200px]">
        <h2 className="font-piepie font-bold text-xl mb-2">{name}</h2>
        <p className="text-sm text-hive-black/60 mb-8">{bio}</p>
        
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 sm:absolute sm:bottom-4 sm:right-4">
            {onEditClick && (
              <button
                onClick={onEditClick}
                className="w-full sm:w-auto px-4 py-2 bg-hive-yellow text-black font-bold rounded-lg border-2 border-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none transition-all duration-200"
              >
                Modifier le profil
              </button>
            )}
            {onButtonClick && (
              <button
                onClick={onButtonClick}
                className="w-full sm:w-auto px-4 py-2 bg-[#FF8A00] text-hive-black font-bold rounded-lg border-2 border-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none transition-all duration-200"
              >
                {buttonText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;