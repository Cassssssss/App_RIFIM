import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Systems } from './pages/Systems';
import { AnatomicalLocations } from './pages/AnatomicalLocations';
import { AddFolder } from './pages/AddFolder';
import { LocationDetail } from './pages/LocationDetail';
import { AddContent } from './pages/AddContent';
import { EditContent } from './pages/EditContent';
import { ViewContent } from './pages/ViewContent'; // Nouveau import

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f5f6f8]">
        <Routes>
          <Route path="/" element={<Systems />} />
          <Route path="/system/:systemId" element={<AnatomicalLocations />} />
          <Route path="/add-folder/system" element={<AddFolder type="system" />} />
          <Route path="/add-folder/location/:systemId" element={<AddFolder type="location" />} />
          <Route path="/system/:systemId/location/:locationId" element={<LocationDetail />} />
          <Route path="/system/:systemId/location/:locationId/content/:type" element={<AddContent />} />
          <Route path="/system/:systemId/location/:locationId/content/:type/:contentId/view" element={<ViewContent />} /> {/* Route modifiée */}
          <Route path="/system/:systemId/location/:locationId/content/:type/edit/:contentId" element={<EditContent />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;