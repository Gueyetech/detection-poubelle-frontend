import React, { useState, useRef } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function PredictVideo() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
      setProgress(0);
    } else {
      setError('Veuillez sélectionner un fichier vidéo valide');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner une vidéo');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${API_URL}/api/predict/video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la prédiction');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Détection sur Vidéo
          </span>
        </h1>
        <p className="text-xl text-gray-600">
          Uploadez une vidéo pour détecter les poubelles frame par frame
        </p>
      </div>

      {/* Upload Section */}
      <div className="mb-12">
        <div
          className={`border-4 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
            isDragging
              ? 'border-blue-500 bg-blue-50 scale-105'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
            id="video-upload"
          />
          
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                Glissez-déposez votre vidéo ici
              </h3>
              <p className="text-gray-500">ou</p>
            </div>
            <label
              htmlFor="video-upload"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Parcourir les fichiers
            </label>
            <p className="text-sm text-gray-500">
              Formats acceptés: MP4, AVI, MOV, MKV
            </p>
          </div>
        </div>
      </div>

      {/* Preview & Results */}
      {preview && (
        <div className="space-y-8">
          {/* Original Video */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
              Vidéo Originale
            </h3>
            <div className="relative rounded-xl overflow-hidden bg-black mb-4">
              <video src={preview} controls className="w-full max-h-96" />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePredict}
                disabled={loading}
                className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Traitement en cours...' : 'Analyser la vidéo'}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                Réinitialiser
              </button>
            </div>

            {/* Progress Bar */}
            {loading && progress > 0 && (
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Upload en cours</span>
                  <span className="text-sm font-bold text-blue-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Processed Video */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                  Vidéo Annotée
                </h3>
                <div className="relative rounded-xl overflow-hidden bg-black">
                  <video
                    src={result.video}
                    controls
                    className="w-full max-h-96"
                  />
                </div>
              </div>

              {/* Statistics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-300 shadow-lg">
                  <div className="text-blue-600 font-semibold mb-2">Total Frames</div>
                  <div className="text-4xl font-bold text-blue-700">
                    {result.frames_processed || 0}
                  </div>
                  <div className="text-sm text-blue-600 mt-1">frames analysées</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-300 shadow-lg">
                  <div className="text-purple-600 font-semibold mb-2">Détections Totales</div>
                  <div className="text-4xl font-bold text-purple-700">
                    {result.total_detections || 0}
                  </div>
                  <div className="text-sm text-purple-600 mt-1">objets détectés</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-300 shadow-lg">
                  <div className="text-green-600 font-semibold mb-2">Poubelles Vides</div>
                  <div className="text-4xl font-bold text-green-700">
                    {result.detection_stats?.poubelle_vide || 0}
                  </div>
                  <div className="text-sm text-green-600 mt-1">détections totales</div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border-2 border-red-300 shadow-lg">
                  <div className="text-red-600 font-semibold mb-2">Poubelles Pleines</div>
                  <div className="text-4xl font-bold text-red-700">
                    {result.detection_stats?.poubelle_pleine || 0}
                  </div>
                  <div className="text-sm text-red-600 mt-1">détections totales</div>
                </div>
              </div>

              {/* Processing Info */}
              {result.video_info && (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold mb-1">
                        {result.video_info.fps}
                      </div>
                      <div className="text-sm opacity-80">FPS vidéo</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold mb-1">
                        {result.video_info.width}x{result.video_info.height}
                      </div>
                      <div className="text-sm opacity-80">Résolution</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold mb-1">
                        {result.average_detections_per_frame?.toFixed(1) || 0}
                      </div>
                      <div className="text-sm opacity-80">Détections/frame</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 flex items-center space-x-4">
          <div className="text-4xl">⚠️</div>
          <div>
            <h4 className="text-xl font-bold text-red-700 mb-1">Erreur</h4>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-md">
            <div className="text-6xl mb-4">🎬</div>
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 border-8 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Traitement vidéo en cours...</h3>
            <p className="text-gray-600 mb-4">Le modèle YOLOv8 analyse chaque frame</p>
            <p className="text-sm text-gray-500">
              ⚡ Cela peut prendre quelques instants selon la longueur de la vidéo
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PredictVideo;
