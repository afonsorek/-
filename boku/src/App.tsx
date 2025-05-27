import React from "react";
import Card from "./components/card.tsx";
import "./App.css";

export default function App() {
  return (
    <div className="h-screen relative font-departure">
      {/* Gradiente por trás de tudo */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500 to-indigo-800 -z-20" />

      {/* Fundo animado com blur, acima do gradiente */}
      <div className="absolute inset-0 bg-water-animated -z-10" />

      {/* Conteúdo Card, acima de tudo */}
      <div className="relative h-full flex flex-wrap justify-center content-center z-0">
        <Card />
      </div>
    </div>
  );
}
