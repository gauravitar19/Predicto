
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface TeamMatchupProps {
  team1: string;
  team2: string;
  probability: number;
}

const TeamMatchup: React.FC<TeamMatchupProps> = ({ team1, team2, probability }) => {
  return (
    <div className="relative py-6">
      <div className="flex justify-between items-center">
        <motion.div 
          className="text-center flex-1"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block p-4 rounded-full bg-gradient-to-br from-cricket-50 to-cricket-100 dark:from-cricket-900 dark:to-cricket-800 shadow-md mb-3">
            <span className="text-2xl font-bold text-cricket-700 dark:text-cricket-300">
              {team1}
            </span>
          </div>
          <div className={`text-sm font-medium ${probability > 50 ? 'text-cricket-600 dark:text-cricket-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {probability > 50 ? (
              <span className="flex items-center justify-center">
                Favored <Sparkles className="ml-1 h-3 w-3" />
              </span>
            ) : 'Underdog'}
          </div>
        </motion.div>
        
        <div className="relative mx-4 w-24 text-center">
          <motion.div 
            className="text-3xl font-bold"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            VS
          </motion.div>
          <motion.div 
            className="absolute w-full h-[2px] bg-gradient-to-r from-cricket-200 via-cricket-500 to-cricket-200 dark:from-cricket-800 dark:via-cricket-500 dark:to-cricket-800 top-1/2 -z-10"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          />
        </div>
        
        <motion.div 
          className="text-center flex-1"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block p-4 rounded-full bg-gradient-to-br from-cricket-50 to-cricket-100 dark:from-cricket-900 dark:to-cricket-800 shadow-md mb-3">
            <span className="text-2xl font-bold text-cricket-700 dark:text-cricket-300">
              {team2}
            </span>
          </div>
          <div className={`text-sm font-medium ${probability <= 50 ? 'text-cricket-600 dark:text-cricket-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {probability <= 50 ? (
              <span className="flex items-center justify-center">
                Favored <Sparkles className="ml-1 h-3 w-3" />
              </span>
            ) : 'Underdog'}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamMatchup;
