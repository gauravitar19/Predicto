
import { pipeline } from '@huggingface/transformers';

// Initialize models - these will be loaded on demand
let sentimentAnalyzer: any = null;
let modelLoading = false;
let modelLoaded = false;
let modelError: Error | null = null;

// Get the model loading status
export const getModelStatus = () => ({
  loading: modelLoading,
  loaded: modelLoaded,
  error: modelError,
});

// Initialize the sentiment analysis model
export const initializeAiModels = async () => {
  if (modelLoaded || modelLoading) return;
  
  modelLoading = true;
  modelError = null;
  
  try {
    console.log("Loading sentiment analysis model...");
    
    // Create a sentiment-analysis pipeline
    sentimentAnalyzer = await pipeline(
      'sentiment-analysis',
      'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
    );
    
    modelLoaded = true;
    console.log("Sentiment analysis model loaded successfully");
  } catch (error) {
    console.error("Error loading AI model:", error);
    modelError = error instanceof Error ? error : new Error(String(error));
  } finally {
    modelLoading = false;
  }
};

// Analyze team sentiment based on their stats and recent performance
export const analyzeTeamSentiment = async (
  teamName: string, 
  recentWins: number,
  totalMatches: number = 10,
  battingAvg: number,
  bowlingAvg: number
) => {
  if (!modelLoaded || !sentimentAnalyzer) {
    throw new Error("AI model not loaded yet");
  }
  
  // Create a description of the team's performance to analyze
  const winRate = (recentWins / totalMatches) * 100;
  const description = `
    ${teamName} has won ${recentWins} out of their last ${totalMatches} matches,
    with a win rate of ${winRate.toFixed(1)}%.
    They have a batting average of ${battingAvg} and bowling average of ${bowlingAvg}.
    ${battingAvg > 35 ? "Their batting is strong." : "Their batting needs improvement."}
    ${bowlingAvg < 25 ? "Their bowling is excellent." : "Their bowling could be better."}
  `;
  
  try {
    const result = await sentimentAnalyzer(description);
    return {
      teamName,
      sentiment: result[0].label,
      score: result[0].score,
      confidence: result[0].label === "POSITIVE" ? result[0].score : 1 - result[0].score,
      description
    };
  } catch (error) {
    console.error(`Error analyzing sentiment for ${teamName}:`, error);
    throw error;
  }
};
