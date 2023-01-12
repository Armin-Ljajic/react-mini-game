import logo from './logo.svg';
import './App.css';
import Game from '../src/components/Game'
import { Canvas } from '@react-three/fiber';
import { Crosshair } from './components/Crosshair';

function App() {
  return (
    <div className="App">
        <Game/>      
    </div>
  );
}

export default App;
