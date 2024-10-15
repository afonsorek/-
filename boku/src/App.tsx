import React from 'react';
import Card from './components/card.tsx';
import './App.css';

export default function App() {
  return (
    <div className="h-screen bg-gradient-to-b from-purple-400 to-violet-700">
      <div className="h-screen bg-cover bg-water-texture content-center flex flex-wrap justify-center">
        <Card />
      </div>
    </div>
  );
}