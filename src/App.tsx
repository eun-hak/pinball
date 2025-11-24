import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { PlinkoGame } from './pages/PlinkoGame';
import { RaceGame } from './pages/RaceGame';
import { SurvivalGame } from './pages/SurvivalGame';
import { ColorGame } from './pages/ColorGame';

export default function App() {
  const [currentGame, setCurrentGame] = useState<'home' | 'plinko' | 'race' | 'survival' | 'color'>('home');

  return (
    <div className="min-h-screen bg-black">
      <Navigation currentGame={currentGame} onGameChange={setCurrentGame} />
      
      {currentGame === 'home' && <Home onGameSelect={setCurrentGame} />}
      {currentGame === 'plinko' && <PlinkoGame />}
      {currentGame === 'race' && <RaceGame />}
      {currentGame === 'survival' && <SurvivalGame />}
      {currentGame === 'color' && <ColorGame />}
    </div>
  );
}
