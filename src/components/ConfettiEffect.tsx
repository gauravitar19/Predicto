
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  scale: number;
  velocity: {
    x: number;
    y: number;
  };
}

const colors = ['#3B82F6', '#60A5FA', '#93C5FD', '#FB923C', '#FDBA74', '#FED7AA'];
const shapes = ['square', 'circle', 'triangle'];

const ConfettiEffect: React.FC = () => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  
  useEffect(() => {
    // Create confetti pieces
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 100; i++) {
      pieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 100,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: 0.5 + Math.random() * 1,
        velocity: {
          x: (Math.random() - 0.5) * 8,
          y: 3 + Math.random() * 5
        }
      });
    }
    
    setConfetti(pieces);
    
    // Cleanup timer
    const timer = setTimeout(() => {
      setConfetti([]);
    }, 6000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="confetti-container">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          initial={{ 
            x: piece.x, 
            y: piece.y, 
            rotate: 0,
            scale: 0
          }}
          animate={{ 
            x: piece.x + piece.velocity.x * 60, 
            y: window.innerHeight + 100, 
            rotate: piece.rotation + (Math.random() * 720 - 360),
            scale: piece.scale
          }}
          transition={{ 
            type: "tween",
            duration: 2.5 + Math.random() * 3.5,
            ease: "easeIn" 
          }}
          style={{ backgroundColor: piece.color }}
        >
          {
            shapes[Math.floor(Math.random() * shapes.length)] === 'square' ? (
              <div className="w-3 h-3 opacity-80" />
            ) : shapes[Math.floor(Math.random() * shapes.length)] === 'circle' ? (
              <div className="w-3 h-3 rounded-full opacity-80" />
            ) : (
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[12px] border-transparent border-b-current opacity-80" 
                   style={{ color: piece.color }} />
            )
          }
        </motion.div>
      ))}
    </div>
  );
};

export default ConfettiEffect;
