import React, { useState, useRef, useEffect } from 'react';
import './ColorDropper.css';

interface ColorDropperProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onColorSelect: (color: string) => void;
  isPicking: boolean;
  setIsPicking: React.Dispatch<React.SetStateAction<boolean>>;
}

const ColorDropper: React.FC<ColorDropperProps> = ({
  canvasRef,
  onColorSelect,
  isPicking,
  setIsPicking,
}) => {
  const [color, setColor] = useState<string>('#FFFFFF');
  const [zoom] = useState<number>(2);
  const dropperRef = useRef<HTMLDivElement>(null);
  const magnifierRef = useRef<HTMLCanvasElement>(null);

  const updateMagnifier = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const magnifier = magnifierRef.current;
    if (canvas && magnifier) {
      const context = canvas.getContext('2d', { willReadFrequently: true });
      const magnifierContext = magnifier.getContext('2d');

      if (context && magnifierContext) {
        const scale = zoom;
        const magnifierSize = 100;
        const cellSize = 8;

        magnifier.width = magnifierSize;
        magnifier.height = magnifierSize;

        magnifierContext.clearRect(0, 0, magnifier.width, magnifier.height);
        magnifierContext.save();
        magnifierContext.scale(scale, scale);

        const startX = x - magnifierSize / 2 / scale;
        const startY = y - magnifierSize / 2 / scale;
        magnifierContext.drawImage(
          canvas,
          startX,
          startY,
          magnifierSize / scale,
          magnifierSize / scale,
          0,
          0,
          magnifierSize,
          magnifierSize
        );

        magnifierContext.restore();

        // Get image data for the specified area
        const imageData = magnifierContext.getImageData(
          0,
          0,
          magnifierSize,
          magnifierSize
        );
        const data = imageData.data;

        // Draw pixelated cells and grid
        for (let i = 0; i < magnifierSize; i += cellSize) {
          for (let j = 0; j < magnifierSize; j += cellSize) {
            const index = (i + j * magnifierSize) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            // Fill the cell
            magnifierContext.fillStyle = `rgb(${r},${g},${b})`;
            magnifierContext.fillRect(i, j, cellSize, cellSize);

            // Draw grid lines
            magnifierContext.strokeStyle = 'rgba(128, 128, 128, 0.5)';
            magnifierContext.strokeRect(i, j, cellSize, cellSize);
          }
        }

        // Draw center cell with a thicker border
        const centerX = Math.floor(magnifierSize / 2 / cellSize) * cellSize;
        const centerY = Math.floor(magnifierSize / 2 / cellSize) * cellSize;
        magnifierContext.strokeStyle = 'black';
        magnifierContext.lineWidth = 1;
        magnifierContext.strokeRect(centerX, centerY, cellSize, cellSize);

        // Draw center color
        const centerIndex = (centerX + centerY * magnifierSize) * 4;

        const red = data[centerIndex];
        const green = data[centerIndex + 1];
        const blue = data[centerIndex + 2];

        const redHex = red.toString(16).padStart(2, '0').toUpperCase();
        const greenHex = green.toString(16).padStart(2, '0').toUpperCase();
        const blueHex = blue.toString(16).padStart(2, '0').toUpperCase();

        const centerColor = `#${redHex}${greenHex}${blueHex}`;

        setColor(centerColor);
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.pageX - rect.left - window.scrollX;
      const y = e.pageY - rect.top - window.scrollY;

      if (dropperRef.current) {
        dropperRef.current.style.left = `${e.pageX - dropperRef.current.clientWidth / 2 - 25}px`;
        dropperRef.current.style.top = `${e.pageY - dropperRef.current.clientHeight / 2 - 25}px`;
        updateMagnifier(x, y);
      }
    }
  };

  const handleMouseClick = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (canvas && isPicking) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        setIsPicking(false);
        onColorSelect(color);
        e.stopPropagation();
        e.preventDefault();
      }
    }
  };

  useEffect(() => {
    if (isPicking) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('click', handleMouseClick);
      document.body.style.cursor = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleMouseClick);
      document.body.style.cursor = 'default';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleMouseClick);
      document.body.style.cursor = 'default';
    };
  }, [isPicking, color]);

  return (
    <div
      ref={dropperRef}
      className={`color-dropper ${isPicking ? 'visible' : 'hidden'}`}
      style={{
        border: `12px solid ${color}`,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
      }}
    >
      <canvas
        ref={magnifierRef}
        className="magnifier"
        style={{
          visibility: isPicking ? 'visible' : 'hidden',
        }}
      />
      <span className="color-label">{color}</span>
    </div>
  );
};

export default ColorDropper;
