
import React, { useEffect, useState } from 'react';
import { getModelStatus, initializeAiModels } from '@/utils/aiAnalysis';
import { Button } from "@/components/ui/button";
import { Loader2, Brain } from 'lucide-react';

interface AiAnalysisStatusProps {
  enabled: boolean;
}

const AiAnalysisStatus: React.FC<AiAnalysisStatusProps> = ({ enabled }) => {
  const [status, setStatus] = useState(getModelStatus());
  
  useEffect(() => {
    if (!enabled) return;
    
    // Initialize AI models when component mounts and AI is enabled
    const loadModel = async () => {
      await initializeAiModels();
      setStatus(getModelStatus());
    };
    
    loadModel();
    
    // Check status regularly
    const interval = setInterval(() => {
      setStatus(getModelStatus());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [enabled]);
  
  if (!enabled) return null;
  
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 mt-4">
      <div className="flex items-center space-x-3">
        <Brain className="h-5 w-5 text-blue-500" />
        <div className="flex-1">
          <h3 className="font-medium">AI Match Analysis</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {status.loading ? (
              "Loading sentiment analysis model..."
            ) : status.loaded ? (
              "AI model loaded and ready"
            ) : status.error ? (
              `Error: ${status.error.message}`
            ) : (
              "Model will load when needed"
            )}
          </p>
        </div>
        {status.loading && (
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        )}
        {status.error && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => initializeAiModels()}
          >
            Retry
          </Button>
        )}
      </div>
    </div>
  );
};

export default AiAnalysisStatus;
