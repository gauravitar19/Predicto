
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from 'framer-motion';

interface MatchFormatSelectorProps {
  matchFormat: string;
  setMatchFormat: (format: string) => void;
}

const MatchFormatSelector: React.FC<MatchFormatSelectorProps> = ({ 
  matchFormat, 
  setMatchFormat 
}) => {
  return (
    <div className="space-y-2">
      <Label className="font-medium text-gray-700 dark:text-gray-300">Match Format</Label>
      <div className="flex overflow-hidden rounded-md">
        <motion.div 
          whileTap={{ scale: 0.95 }}
          className="flex-1"
        >
          <Button
            type="button"
            variant={matchFormat === 'odi' ? 'default' : 'outline'}
            className={`flex-1 w-full ${matchFormat === 'odi' ? 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600' : ''} btn-click-effect`}
            onClick={() => setMatchFormat('odi')}
          >
            ODI
          </Button>
        </motion.div>
        <motion.div 
          whileTap={{ scale: 0.95 }}
          className="flex-1"
        >
          <Button
            type="button"
            variant={matchFormat === 't20' ? 'default' : 'outline'} 
            className={`flex-1 w-full ${matchFormat === 't20' ? 'bg-gradient-to-r from-blue-400 to-orange-300 hover:from-blue-500 hover:to-orange-400' : ''} btn-click-effect`}
            onClick={() => setMatchFormat('t20')}
          >
            T20
          </Button>
        </motion.div>
        <motion.div 
          whileTap={{ scale: 0.95 }}
          className="flex-1"
        >
          <Button
            type="button"
            variant={matchFormat === 'test' ? 'default' : 'outline'}
            className={`flex-1 w-full ${matchFormat === 'test' ? 'bg-gradient-to-r from-orange-300 to-orange-400 hover:from-orange-400 hover:to-orange-500' : ''} btn-click-effect`}
            onClick={() => setMatchFormat('test')}
          >
            Test
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MatchFormatSelector;
