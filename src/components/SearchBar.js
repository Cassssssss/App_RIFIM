import React from 'react';
import { Search } from 'lucide-react';

export const SearchBar = () => (
  <div className="relative">
    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
    <input
      type="text"
      placeholder="Rechercher..."
      className="w-full p-2 pl-10 rounded-lg border border-gray-300"
    />
  </div>
);