import { FC } from 'react';

interface ProfileCardProps {
  name: string;
  bio: string;
  imageSrc: string;
  onButtonClick?: () => void;
  buttonText?: string;
}

const ProfileCard: FC<ProfileCardProps> = ({
  name,
  bio,
  imageSrc,
  onButtonClick,
  buttonText = 'Voir le profil'
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
        
        <button
          onClick={onButtonClick}
          className="absolute bottom-4 right-4 px-4 py-2 bg-[#FF8A00] text-hive-black font-bold rounded-lg border-2 border-black shadow-[4px_4px_0_#000000] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000000] transition-all duration-200"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;