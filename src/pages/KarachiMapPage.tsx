import React from 'react';
import { Navbar } from '../components/Navbar';
import { MapView } from '../components/MapView';

export const KarachiMapPage: React.FC = () => {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#070c18]">
      <Navbar />
      <main className="flex-1 w-full relative">
        <MapView />
      </main>
    </div>
  );
};
