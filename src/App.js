import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PredictImage from './pages/PredictImage';
import PredictVideo from './pages/PredictVideo';

function App() {
  return (
    <Router>
      <div className='min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex flex-col'>
        <Navbar />
        <main className='flex-1'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/predict-image' element={<PredictImage />} />
            <Route path='/predict-video' element={<PredictVideo />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
