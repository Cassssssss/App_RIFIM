import React, { useState } from 'react';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { LocationCard } from '../components/LocationCard';
import { AddButton } from '../components/AddButton';

export const Home = () => {
  const [locations] = useState([
    { id: 1, name: 'Épaule' },
    { id: 2, name: 'Coude' },
    { id: 3, name: 'Poignet' },
    { id: 4, name: 'Rachis' },
    { id: 5, name: 'Hanche' },
    { id: 6, name: 'Genou' },
    { id: 7, name: 'Cheville' },
    { id: 8, name: 'Pied' },
  ]);

  return (
    <div>
      <Header title="Localisations anatomiques" showBack={false} />
      <div className="p-4">
        <SearchBar />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </div>
      <AddButton />
    </div>
  );
};