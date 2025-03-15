
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import TeamMatchup from '@/components/TeamMatchup';
import { CricketGround } from '@/utils/supabaseClient';

interface PredictionHeaderProps {
  winner: string;
  probability: number;
  team1: string;
  team2: string;
  matchFormat: string;
  venue: string;
  venueDetails: CricketGround | null;
}

const PredictionHeader: React.FC<PredictionHeaderProps> = ({ 
  winner, 
  probability, 
  team1, 
  team2, 
  matchFormat, 
  venue,
  venueDetails 
}) => {
  const getColorByProbability = (prob: number) => {
    if (prob > 75) return "bg-gradient-to-r from-blue-400 to-orange-300";
    if (prob > 50) return "bg-gradient-to-r from-blue-300 to-orange-200";
    return "bg-gradient-to-r from-blue-200 to-orange-100";
  };

  return (
    <div className="text-center mb-8">
      <motion.div
        className="inline-flex items-center gap-2 mb-4 px-4 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full text-sm font-medium"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span>{matchFormat.toUpperCase()} Match</span>
        {venueDetails ? (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="flex items-center gap-1">{venueDetails.ground_long}, {venueDetails.country}</span>
          </div>
        ) : (
          <span>at {venue}</span>
        )}
      </motion.div>
      
      <TeamMatchup team1={team1} team2={team2} probability={probability} />
      
      <motion.div className="mt-8 mb-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-2"
        >
          <h3 className="text-xl font-semibold">Predicted Winner</h3>
          <motion.div 
            className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/40 dark:to-orange-900/40 px-6 py-3 rounded-lg"
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0 rgba(59, 130, 246, 0)",
                "0 0 20px rgba(59, 130, 246, 0.5)",
                "0 0 0 rgba(59, 130, 246, 0)"
              ]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop" 
            }}
          >
            <Zap className="text-orange-500 h-5 w-5" />
            <span className="text-3xl font-bold gradient-text">
              {winner}
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
      
      <div className="max-w-md mx-auto mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Prediction Confidence</span>
          <span className="font-medium">{probability}%</span>
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Progress 
            value={probability} 
            className="h-3 rounded-full" 
            indicatorClassName={getColorByProbability(probability)}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default PredictionHeader;
