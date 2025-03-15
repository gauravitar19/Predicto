import React from 'react';
import PredictionFormContainer from './prediction-form/PredictionFormContainer';

interface PredictionFormProps {
  onPredictionResult: (result: any) => void;
  matchId?: string | null;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredictionResult, matchId }) => {
  return <PredictionFormContainer onPredictionResult={onPredictionResult} matchId={matchId} />;
};

export default PredictionForm;
