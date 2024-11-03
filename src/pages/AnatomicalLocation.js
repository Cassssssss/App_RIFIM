import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';

export const AnatomicalLocation = () => {
  const tabs = [
    { id: 'measures', name: 'Repères & Mesures' },
    { id: 'classifications', name: 'Classifications' },
  ];

  return (
    <div>
      <Header title="Genou" />
      <div className="flex justify-around bg-white shadow">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={`/location/6/${tab.id}`}
            className="flex-1 text-center p-4 border-b-2 border-transparent hover:border-primary"
          >
            {tab.name}
          </Link>
        ))}
      </div>
    </div>
  );
};