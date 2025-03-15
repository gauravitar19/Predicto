import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database, Info } from 'lucide-react';
import ConfettiEffect from './ConfettiEffect';
import { PredictionResult } from '@/utils/types/predictionTypes';
import PredictionHeader from './prediction-result/PredictionHeader';
import AiAnalysisSection from './prediction-result/AiAnalysisSection';
import VenueDetailsSection from './prediction-result/VenueDetailsSection';
import FactorsSection from './prediction-result/FactorsSection';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ResultDisplayProps {
  result: PredictionResult;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    setShowConfetti(true);
    
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 6000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {showConfetti && <ConfettiEffect />}
      
      <Card className="overflow-hidden glass-panel border-0">
        <div className="bg-gradient-to-r from-blue-500 to-orange-400 p-4 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Prediction Results</h2>
            <div className="flex space-x-2">
              {result.realTimeStatsUsed && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="bg-green-500/30 border-green-300 text-white">
                        <Database className="h-3 w-3 mr-1" /> Real-Time Data
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Using live match data for enhanced accuracy</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {result.aiAnalysisUsed && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="bg-blue-500/30 border-blue-300 text-white">
                        <Info className="h-3 w-3 mr-1" /> AI Enhanced
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Using AI analysis for better predictions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          {/* Prediction Header Section */}
          <PredictionHeader
            winner={result.winner}
            probability={result.probability}
            team1={result.team1}
            team2={result.team2}
            matchFormat={result.matchFormat}
            venue={result.venue}
            venueDetails={result.venueDetails}
          />
          
          {/* AI Analysis Section */}
          <AiAnalysisSection result={result} />
          
          {/* Real-Time Data Section */}
          {result.realTimeStatsUsed && result.realTimeData && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center">
                <Database className="w-4 h-4 mr-2" /> 
                Real-Time Match Analysis
              </h3>
              
              <div className="space-y-3">
                {/* H2H Stats */}
                {result.realTimeData.h2h && (
                  <div>
                    <p className="font-medium">Head-to-Head Record:</p>
                    <div className="grid grid-cols-3 text-sm mt-1">
                      <div className="text-center">{result.team1}: <span className="font-medium">{result.realTimeData.h2h.teamHomeWins}</span></div>
                      <div className="text-center">Draws: <span className="font-medium">{result.realTimeData.h2h.noResult}</span></div>
                      <div className="text-center">{result.team2}: <span className="font-medium">{result.realTimeData.h2h.teamAwayWins}</span></div>
                    </div>
                  </div>
                )}
                
                {/* Recent Form */}
                {result.realTimeData.recentForm && (
                  <div>
                    <p className="font-medium">Recent Form (Last 10 Matches):</p>
                    <div className="grid grid-cols-2 text-sm mt-1 gap-2">
                      <div>
                        {result.team1}: <span className="font-medium">
                          {result.realTimeData.recentForm[result.team1]?.matchesWon || 0} wins
                        </span> / 
                        <span className="font-medium">
                          {result.realTimeData.recentForm[result.team1]?.totalMatches || 0} matches
                        </span>
                      </div>
                      <div>
                        {result.team2}: <span className="font-medium">
                          {result.realTimeData.recentForm[result.team2]?.matchesWon || 0} wins
                        </span> / 
                        <span className="font-medium">
                          {result.realTimeData.recentForm[result.team2]?.totalMatches || 0} matches
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Key Players */}
                {result.realTimeData.keyPlayers && (
                  <div>
                    <p className="font-medium">Key Players in Form:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                      <div>
                        {result.realTimeData.keyPlayers[result.team1]?.map((player, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{player.name}</span>
                            <span className="font-medium">{player.recentForm}/10</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        {result.realTimeData.keyPlayers[result.team2]?.map((player, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{player.name}</span>
                            <span className="font-medium">{player.recentForm}/10</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Venue Details Section (if available) */}
          {result.venueDetails && (
            <VenueDetailsSection venueDetails={result.venueDetails} />
          )}
          
          {/* Prediction Factors Section */}
          <FactorsSection factors={result.factors} />
          
          {/* Reset Button */}
          <div className="text-center">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={onReset}
                variant="outline" 
                className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900 transition-all duration-300 btn-click-effect"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Make Another Prediction
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResultDisplay;
