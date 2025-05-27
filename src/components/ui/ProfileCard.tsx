import { FC } from 'react';

interface ProfileCardProps {
  name: string;
  bio: string;
  imageSrc: string;
  onButtonClick?: () => void;
  buttonText?: string;
  onEditClick?: () => void;
}

const ProfileCard: FC<ProfileCardProps> = ({
  name,
  bio,
  imageSrc,
  onButtonClick,
  buttonText = 'Voir le profil',
  onEditClick
}) => {
  return (
    <div className="flex h-[200px] w-[800px] bg-[#FFFDE3] p-4 gap-4">
      <div className="flex-shrink-0">
        <img
          src={imageSrc}
          alt={`Photo de profil de ${name}`}
          className="w-[200px] h-[200px] object-cover rounded-[20px] border-2 border-black shadow-[4px_4px_0_#000000]"
        />
      </div>
      
      <div className="flex-grow h-[200px] bg-white rounded-[16px] border-2 border-black shadow-[4px_4px_0_#000000] p-4 relative">
        <h2 className="font-piepie font-bold text-xl mb-2">{name}</h2>
        <p className="text-sm text-gray-600 mb-8">{bio}</p>
        
        <div className="absolute bottom-4 right-4 flex gap-2">
          {onEditClick && (
            <button
              onClick={onEditClick}
              className="px-4 py-2 bg-hive-yellow text-black font-bold rounded-lg border-2 border-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none transition-all duration-200"
            >
              Modifier le profil
            </button>
          )}
          <button
            onClick={onButtonClick}
            className="px-4 py-2 bg-[#FF8A00] text-hive-black font-bold rounded-lg border-2 border-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none transition-all duration-200"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;