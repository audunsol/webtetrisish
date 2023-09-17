import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Shape } from './Shape';

export const Board: React.FC<{ width: number; height: number }> = (props: { width: number; height: number }) => {
  const [movingShape, setMovingShape] = useState<Shape | null>(null);
  const [stuckShapes, setStuckShape] = useState<Shape[]>([]);

  const { width, height } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = async (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "gray"
    ctx.fillRect(0,0, ctx.canvas.width, ctx.canvas.height);
    stuckShapes.forEach(s => s.draw());
    if (movingShape == null) {
      setMovingShape(new Shape({ ctx }));
    } else {
      movingShape.draw();
    }
  };

  const onTick = (ctx: CanvasRenderingContext2D) => {
    if (movingShape) {
      const updatedShape = movingShape.step();
      if (updatedShape.didHit(stuckShapes)) {
        setMovingShape(new Shape({ctx}));
        setStuckShape([...stuckShapes, movingShape]);
        console.log('Added new shape to stuck, size ', stuckShapes.length);

      } else {
        // movingShape.clear();
        setMovingShape(updatedShape);
      }
    }
  };

  const handleKeyPress = useCallback((evt: KeyboardEvent) => {
    const { code } = evt;
    switch (code) {
      case 'ArrowLeft': {
        setMovingShape(prevShape => prevShape?.moveLeft() || prevShape);
        break;
      }
      case 'ArrowUp': {
        setMovingShape(prevShape => prevShape?.rotateLeft() || prevShape);
        break;
      }
      case 'ArrowRight': {
        setMovingShape(prevShape => prevShape?.moveRight() || prevShape);
        break;
      }
      case 'ArrowDown': {
        setMovingShape(prevShape => prevShape?.rotateRight() || prevShape);
        break;
      }
      case 'Space': {
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return function cleanup() {
      window.removeEventListener('keydown', handleKeyPress)
    };
  }, [handleKeyPress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) {
      throw new Error('Could not get canvas!');
    }
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      throw new Error('Could not get context');
    }
    draw(ctx);

    const interval = setInterval(() => onTick(ctx), 100);
    return function cleanup() {
      clearInterval(interval);
    };
  }, [draw, onTick]);

  return <canvas ref={canvasRef} width={width} height={height}></canvas>
};
