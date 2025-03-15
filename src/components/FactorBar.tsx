
import React from 'react';
import { motion } from 'framer-motion';

interface FactorBarProps {
  factor: string;
  weight: number;
  index: number;
}

const FactorBar: React.FC<FactorBarProps> = ({ factor, weight, index }) => {
  // Generate a color based on the weight
  const getColor = (weight: number) => {
    if (weight > 25) return "bg-cricket-500 dark:bg-cricket-400";
    if (weight > 15) return "bg-cricket-400 dark:bg-cricket-300";
    return "bg-cricket-300 dark:bg-cricket-200";
  };

  return (
    <motion.div 
      key={factor}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 + (index * 0.1) }}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{factor}</span>
          <span className="text-xs font-medium px-2 py-1 bg-cricket-50 text-cricket-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">
            Impact: {weight}%
          </span>
        </div>
        <div className="mt-1">
          <div className="bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <motion.div 
              className={`${getColor(weight)} h-2 rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${weight}%` }}
              transition={{ delay: 0.3 + (index * 0.1), duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FactorBar;
