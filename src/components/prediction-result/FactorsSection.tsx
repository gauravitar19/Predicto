
import React from 'react';
import { Info } from 'lucide-react';
import FactorBar from '@/components/FactorBar';
import { PredictionFactor } from '@/utils/types/predictionTypes';

interface FactorsSectionProps {
  factors: PredictionFactor[];
}

const FactorsSection: React.FC<FactorsSectionProps> = ({ factors }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Info className="h-4 w-4 text-blue-500 mr-2" />
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Key Factors Influencing This Prediction</h4>
      </div>
      
      <div className="space-y-3">
        {factors.map((factor, index) => (
          <FactorBar 
            key={factor.factor}
            factor={factor.factor} 
            weight={factor.weight}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default FactorsSection;
