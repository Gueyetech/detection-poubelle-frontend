import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function Home() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = async () => {
    try {
      const [healthResponse, infoResponse] = await Promise.all([
        axios.get(`${API_URL}/api/health`),
        axios.get(`${API_URL}/api/info`)
      ]);
      
      setHealthStatus(healthResponse.data);
      setModelInfo(infoResponse.data);
    } catch (err) {
      console.error('Erreur:', err);
      setHealthStatus({ status: 'unhealthy', model_loaded: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center space-y-6">
           
            
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                EcoDétect AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Système intelligent de détection de poubelles pleines ou vides
            </p>

            {!loading && healthStatus && (
              <div className="inline-flex items-center space-x-4 bg-white rounded-full shadow-lg px-6 py-3 border-2 border-purple-100">
                <div className={`flex items-center space-x-2 ${healthStatus.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                  <div className={`w-3 h-3 rounded-full ${healthStatus.status === 'healthy' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="font-semibold">
                    {healthStatus.status === 'healthy' ? 'Système Opérationnel' : 'Système Hors Ligne'}
                  </span>
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className={`flex items-center space-x-2 ${healthStatus.model_loaded ? 'text-green-600' : 'text-orange-600'}`}>
                  <span className="text-sm font-medium">
                    Modèle: {healthStatus.model_loaded ? 'Chargé ✓' : 'Non chargé'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Fonctionnalités
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/predict-image" className="group">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-500">
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Détection sur Image</h3>
              <p className="text-gray-600 mb-6">
                Analysez une image pour détecter instantanément les poubelles pleines ou vides.
              </p>
              <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">
                Commencer
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link to="/predict-video" className="group">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-500">
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Détection sur Vidéo</h3>
              <p className="text-gray-600 mb-6">
                Traitez une vidéo complète avec détection frame par frame et statistiques détaillées.
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                Commencer
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          
        </div>
      </section>

      {/* Model Info */}
     
   </div>
  );
}

export default Home;
