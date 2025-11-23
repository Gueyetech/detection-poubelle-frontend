import React, { useState, useRef } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL ;

function PredictImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    } else {
      setError('Veuillez sélectionner un fichier image valide');
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
      setError('Veuillez sélectionner une image');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${API_URL}/api/predict/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la prédiction');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    stopCamera();
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
      setError(null);
    } catch (err) {
      setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
      console.error('Erreur caméra:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setResult(null);
        stopCamera();
      }, 'image/jpeg', 0.95);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Détection sur Image
          </span>
        </h1>
        <p className="text-xl text-gray-600">
          Uploadez une image pour détecter les poubelles pleines ou vides
        </p>
      </div>

      {/* Upload Section */}
      <div className="mb-12">
        <div
          className={`border-4 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
            isDragging
              ? 'border-purple-500 bg-purple-50 scale-105'
              : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                Glissez-déposez votre image ici
              </h3>
              <p className="text-gray-500">ou</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <label
                htmlFor="image-upload"
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Parcourir les fichiers
              </label>
              <button
                onClick={startCamera}
                className="inline-block bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Prendre une photo
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Formats acceptés: JPG, PNG, GIF, BMP
            </p>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Prendre une photo</h3>
              <button
                onClick={stopCamera}
                className="text-gray-500 hover:text-red-600 text-3xl font-bold transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden bg-black mb-6">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-h-96 object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={capturePhoto}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Capturer
              </button>
              <button
                onClick={stopCamera}
                className="bg-gray-200 text-gray-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-300 transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview & Results Grid */}
      {preview && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Original Image */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
              Image Originale
            </h3>
            <div className="relative rounded-xl overflow-hidden bg-gray-100">
              <img src={preview} alt="Original" className="w-full h-auto" />
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handlePredict}
                disabled={loading}
                className={`flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Analyse en cours...' : ' Analyser l\'image'}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Result Image */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                Résultat de l'Analyse
              </h3>
              <div className="relative rounded-xl overflow-hidden bg-gray-100 mb-4">
                <img
                  src={`${API_URL}${result.annotated_image}`}
                  alt="Annotated"
                  className="w-full h-auto"
                />
              </div>
              
              {/* Summary Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-300">
                  <div className="text-green-600 font-semibold text-sm mb-1">Poubelles Vides</div>
                  <div className="text-4xl font-bold text-green-700">
                    {result.summary?.class_counts?.poubelle_vide || 0}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-2 border-red-300">
                  <div className="text-red-600 font-semibold text-sm mb-1">Poubelles Pleines</div>
                  <div className="text-4xl font-bold text-red-700">
                    {result.summary?.class_counts?.poubelle_pleine || 0}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detections Detail */}
      {result?.detections && result.detections.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            Détails des Détections ({result.detections.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <th className="px-6 py-4 text-left rounded-tl-xl">#</th>
                  <th className="px-6 py-4 text-left">Classe</th>
                  <th className="px-6 py-4 text-left">Confiance</th>
                  <th className="px-6 py-4 text-left rounded-tr-xl">Coordonnées (x, y, w, h)</th>
                </tr>
              </thead>
              <tbody>
                {result.detections.map((detection, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-gray-200 ${
                      idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    } hover:bg-purple-50 transition-colors`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-700">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-4 py-2 rounded-full font-bold ${
                          detection.class === 'poubelle_pleine'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {detection.class === 'poubelle_pleine' ? ' Pleine' : ' Vide'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full transition-all"
                            style={{ width: `${detection.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-gray-700 min-w-[60px]">
                          {(detection.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">
                      {detection.bbox.map((v) => v.toFixed(0)).join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 flex items-center space-x-4">
          <div>
            <h4 className="text-xl font-bold text-red-700 mb-1">Chargement non effectuer</h4>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-12 text-center shadow-2xl">
           
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Analyse en cours...</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default PredictImage;
