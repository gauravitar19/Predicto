
import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { PredictionResult } from '@/utils/types/predictionTypes';
import { getModelStatus } from '@/utils/aiAnalysis';

interface AiAnalysisSectionProps {
  result: PredictionResult;
}

const AiAnalysisSection: React.FC<AiAnalysisSectionProps> = ({ result }) => {
  // Check if AI analysis was used
  if (!result.aiAnalysisUsed) {
    return null;
  }

  const modelStatus = getModelStatus();

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <motion.div 
        className="bg-gradient-to-r from-blue-50/80 to-orange-50/80 dark:from-blue-900/30 dark:to-orange-900/30 p-4 rounded-lg mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-4 w-4 text-blue-500" />
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Hugging Face AI Analysis</h4>
        </div>
        <div className="text-gray-600 dark:text-gray-400 text-sm">
          {modelStatus.loaded ? (
            <p>
              Enhanced prediction accuracy using sentiment analysis on team performance data.
              AI analysis suggests {result.winner} has a {result.probability}% chance of winning 
              based on recent form and statistical analysis.
            </p>
          ) : (
            <p>
              AI analysis was enabled but the model could not be loaded. 
              The prediction was generated using traditional statistical methods.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AiAnalysisSection;
