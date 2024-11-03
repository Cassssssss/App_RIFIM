import React from 'react';
import { Link } from 'react-router-dom';

export const LocationCard = ({ location }) => (
  <Link to={`/location/${location.id}`} className="block">
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
      <h2 className="text-lg font-semibold text-primary">{location.name}</h2>
    </div>
  </Link>
);