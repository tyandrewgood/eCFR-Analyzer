// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import AgencyDashboard from './components/AgencyDashboard';
import DetailedAnalysis from './components/DetailedAnalysis';
import StatisticsPage from './pages/StatisticsPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<AgencyDashboard />} />
        <Route path="/agency/:slug" element={<DetailedAnalysis />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
