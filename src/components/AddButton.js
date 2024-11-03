import React from 'react';
import { Plus } from 'lucide-react';

export const AddButton = () => (
  <button className="fixed bottom-6 right-6 bg-primary text-white rounded-full p-4 shadow-lg">
    <Plus size={24} />
  </button>
);