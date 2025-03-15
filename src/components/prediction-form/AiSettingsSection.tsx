
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import AiAnalysisStatus from '../AiAnalysisStatus';

interface AiSettingsSectionProps {
  useAI: boolean;
  setUseAI: (value: boolean) => void;
}

const AiSettingsSection: React.FC<AiSettingsSectionProps> = ({ 
  useAI, 
  setUseAI 
}) => {
  return (
    <>
      <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
        <Switch
          id="use-ai"
          checked={useAI}
          onCheckedChange={setUseAI}
        />
        <Label htmlFor="use-ai" className="font-medium">Use AI for Enhanced Analysis</Label>
        <div className="flex-1 text-sm text-gray-500 dark:text-gray-400 ml-2">
          Utilizes Hugging Face transformer models for more accurate prediction
        </div>
      </div>
      
      <AiAnalysisStatus enabled={useAI} />
    </>
  );
};

export default AiSettingsSection;
