import React, { useRef, useEffect, forwardRef } from 'react';
import imageForCanvas from '../assets/imageForCanvas.jpg';

interface CanvasProps {
  width: number;
  height: number;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ width, height }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const canvas = ref
        ? (ref as React.MutableRefObject<HTMLCanvasElement>).current
        : canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          const img = new Image();
          img.src = imageForCanvas;
          img.onload = () => {
            const canvasAspect = canvas.width / canvas.height;
            const imgAspect = img.width / img.height;

            let drawWidth = canvas.width;
            let drawHeight = canvas.height;
            let offsetX = 0;
            let offsetY = 0;

            if (canvasAspect > imgAspect) {
              drawHeight = canvas.width / imgAspect;
              offsetY = (canvas.height - drawHeight) / 2;
            } else {
              drawWidth = canvas.height * imgAspect;
              offsetX = (canvas.width - drawWidth) / 2;
            }

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          };
        }
      }
    }, [width, height, ref]);

    return (
      <canvas
        ref={ref || canvasRef}
        width={width}
        height={height}
        style={{ display: 'block', margin: '0 auto', background: '#fff' }}
      />
    );
  }
);

Canvas.displayName = 'Canvas';

export default Canvas;
