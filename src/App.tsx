import React, { useRef, useState } from 'react';
import Canvas from './components/Canvas';
import ColorDropper from './components/ColorDropper';
import iconColorPicker from './assets/iconColorPicker.svg';
import './App.css';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF');
  const [isPicking, setIsPicking] = useState<boolean>(false);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setIsPicking(false);
  };

  return (
    <div className="App">
      <h1>Color Dropper Tool</h1>
      <header>
        <div className="header-content">
          <h2>Selected Color: {selectedColor}</h2>
          <img
            src={iconColorPicker}
            alt="Color Dropper Icon"
            style={{ cursor: isPicking ? 'none' : 'pointer' }}
            className="color-picker-icon"
            onClick={() => setIsPicking(true)}
          />
        </div>
      </header>
      <Canvas ref={canvasRef} width={1000} height={450} />
      <ColorDropper
        canvasRef={canvasRef}
        onColorSelect={handleColorSelect}
        isPicking={isPicking}
        setIsPicking={setIsPicking}
      />
    </div>
  );
};

export default App;
