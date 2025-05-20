import { FC } from 'react';

const LooksTab: FC = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Exemple de cartes de looks */}
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white rounded-lg border-2 border-black shadow-[4px_4px_0_#000000] overflow-hidden">
            <div className="aspect-[4/5] relative">
              <img
                src="/images/hero-image.svg"
                alt={`Look ${item}`}
                className="w-full h-full object-contain p-4"
              />
            </div>
            <div className="p-4">
              <h3 className="font-satoshi font-bold text-lg">Look #{item}</h3>
              <p className="text-gray-600 text-sm">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LooksTab;