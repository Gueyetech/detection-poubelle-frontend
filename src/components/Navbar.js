import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const API_URL = process.env.REACT_APP_API_URL;

  const navLinks = [
    { path: '/', label: 'Accueil',  },
    { path: '/predict-image', label: 'Image' },
    { path: '/predict-video', label: 'Vidéo'  },
  ];

  const handleDownloadModel = () => {
    window.open(`${API_URL}/api/model/download`, '_blank');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                EcoDétect
              </span>
              <span className="text-xs text-gray-500">Powered by GTECH</span>
            </div>
          </Link>

          <div className="flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2
                  ${location.pathname === link.path
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                  }`}
              >
                <span>{link.icon}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}
            <button
              onClick={handleDownloadModel}
              className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200 flex items-center space-x-2"
              title="Télécharger le modèle YOLO"
            >
              <span className="hidden sm:inline">Modèle</span>
            </button>
            
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
