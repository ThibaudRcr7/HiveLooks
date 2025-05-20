import { FC } from 'react';

const Presentation: FC = () => {
  return (
    <div className="min-h-screen bg-hive-beige py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-piepie text-center mb-8 relative inline-block w-full">
          <span className="text-hive-black [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-[4px] sm:top-[6px] z-0">PRÉSENTATION</span>
          <span className="text-hive-beige [text-shadow:_-1px_-1px_0_#111111,_1px_-1px_0_#111111,_-1px_1px_0_#111111,_1px_1px_0_#111111] sm:[text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">PRÉSENTATION</span>
        </h1>
        <div className="mt-8 text-center">
          <p className="text-lg text-hive-black">Page en construction...</p>
        </div>
      </div>
    </div>
  );
};

export default Presentation;