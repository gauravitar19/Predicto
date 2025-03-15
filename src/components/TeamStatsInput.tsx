
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, TrendingUp, TrendingDown, Trophy, Target } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { fetchTeamStats } from '@/utils/teamStatsApi';
import { Skeleton } from '@/components/ui/skeleton';

interface TeamStatsInputProps {
  team1: string;
  team2: string;
  team1RecentWins: string;
  setTeam1RecentWins: (value: string) => void;
  team1BattingAvg: string;
  setTeam1BattingAvg: (value: string) => void;
  team1BowlingAvg: string;
  setTeam1BowlingAvg: (value: string) => void;
  team2RecentWins: string;
  setTeam2RecentWins: (value: string) => void;
  team2BattingAvg: string;
  setTeam2BattingAvg: (value: string) => void;
  team2BowlingAvg: string;
  setTeam2BowlingAvg: (value: string) => void;
}

const TeamStatsInput: React.FC<TeamStatsInputProps> = ({
  team1,
  team2,
  team1RecentWins,
  setTeam1RecentWins,
  team1BattingAvg,
  setTeam1BattingAvg,
  team1BowlingAvg,
  setTeam1BowlingAvg,
  team2RecentWins,
  setTeam2RecentWins,
  team2BattingAvg,
  setTeam2BattingAvg,
  team2BowlingAvg,
  setTeam2BowlingAvg
}) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null);
  const [team1LastUpdated, setTeam1LastUpdated] = useState<string | null>(null);
  const [team2LastUpdated, setTeam2LastUpdated] = useState<string | null>(null);

  // Auto-fetch team stats when teams are selected
  useEffect(() => {
    if (team1 && !team1LastUpdated) {
      fetchLatestStats(team1, false);
    }
  }, [team1]);

  useEffect(() => {
    if (team2 && !team2LastUpdated) {
      fetchLatestStats(team2, false);
    }
  }, [team2]);

  // Fetch team stats from our API
  const fetchLatestStats = async (teamName: string, showToast = true) => {
    if (!teamName) {
      toast({
        title: "Team not selected",
        description: "Please select a team first",
        variant: "destructive"
      });
      return;
    }

    setIsRefreshing(teamName);
    
    try {
      const stats = await fetchTeamStats(teamName);
      
      if (teamName === team1) {
        setTeam1RecentWins(stats.recentWins.toString());
        setTeam1BattingAvg(stats.battingAvg.toString());
        setTeam1BowlingAvg(stats.bowlingAvg.toString());
        setTeam1LastUpdated(stats.lastUpdated);
        
        if (showToast) {
          toast({
            title: `${team1} Stats Updated`,
            description: `Latest performance data as of ${new Date(stats.lastUpdated).toLocaleTimeString()}`,
          });
        }
      } else if (teamName === team2) {
        setTeam2RecentWins(stats.recentWins.toString());
        setTeam2BattingAvg(stats.battingAvg.toString());
        setTeam2BowlingAvg(stats.bowlingAvg.toString());
        setTeam2LastUpdated(stats.lastUpdated);
        
        if (showToast) {
          toast({
            title: `${team2} Stats Updated`,
            description: `Latest performance data as of ${new Date(stats.lastUpdated).toLocaleTimeString()}`,
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching stats for ${teamName}:`, error);
      toast({
        title: "Error Updating Stats",
        description: "Could not fetch the latest team stats. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(null);
    }
  };

  // Helper function to render the trend indicator
  const renderTrend = (value: number) => {
    if (value > 30) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (value < 25) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <Tabs defaultValue="team1" className="w-full">
      <TabsList className="w-full bg-gray-100 dark:bg-gray-800">
        <TabsTrigger value="team1" className="flex-1">
          {team1 ? team1 : "Team 1"} Stats
        </TabsTrigger>
        <TabsTrigger value="team2" className="flex-1">
          {team2 ? team2 : "Team 2"} Stats
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="team1" className="space-y-4 p-4 bg-white/50 dark:bg-gray-900/50 rounded-b-lg">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {team1LastUpdated ? (
              <>Performance metrics as of {new Date(team1LastUpdated).toLocaleTimeString()}</>
            ) : (
              <>Performance metrics for {team1 || "Team 1"}</>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fetchLatestStats(team1)}
            disabled={isRefreshing === team1 || !team1}
            className="text-xs"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing === team1 ? 'animate-spin' : ''}`} />
            {isRefreshing === team1 ? 'Refreshing...' : 'Real-time Update'}
          </Button>
        </div>
        
        {isRefreshing === team1 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <Label htmlFor="team1-recent-wins" className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                  Recent Wins
                </Label>
                <Badge variant="outline" className="font-mono">
                  {team1RecentWins}/5
                </Badge>
              </div>
              
              <Slider
                id="team1-recent-wins-slider"
                min={0}
                max={5}
                step={1}
                value={[parseInt(team1RecentWins) || 0]}
                onValueChange={(value) => setTeam1RecentWins(value[0].toString())}
                className="py-2"
              />
              
              <Input
                id="team1-recent-wins"
                type="number"
                min="0"
                max="5"
                value={team1RecentWins}
                onChange={(e) => setTeam1RecentWins(e.target.value)}
                className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-1"
              />
            </div>
            
            <div className="space-y-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <Label htmlFor="team1-batting-avg" className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
                  Batting Average
                </Label>
                <div className="flex items-center">
                  {renderTrend(parseFloat(team1BattingAvg) || 0)}
                  <Badge variant="outline" className="font-mono ml-1">
                    {parseFloat(team1BattingAvg).toFixed(1)}
                  </Badge>
                </div>
              </div>
              
              <Input
                id="team1-batting-avg"
                type="number"
                min="0"
                step="0.01"
                value={team1BattingAvg}
                onChange={(e) => setTeam1BattingAvg(e.target.value)}
                className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
            
            <div className="space-y-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <Label htmlFor="team1-bowling-avg" className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <Target className="h-4 w-4 mr-1 text-red-500" />
                  Bowling Average
                </Label>
                <div className="flex items-center">
                  {renderTrend(35 - (parseFloat(team1BowlingAvg) || 0))} {/* Lower is better for bowling */}
                  <Badge variant="outline" className="font-mono ml-1">
                    {parseFloat(team1BowlingAvg).toFixed(1)}
                  </Badge>
                </div>
              </div>
              
              <Input
                id="team1-bowling-avg"
                type="number"
                min="0"
                step="0.01"
                value={team1BowlingAvg}
                onChange={(e) => setTeam1BowlingAvg(e.target.value)}
                className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="team2" className="space-y-4 p-4 bg-white/50 dark:bg-gray-900/50 rounded-b-lg">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {team2LastUpdated ? (
              <>Performance metrics as of {new Date(team2LastUpdated).toLocaleTimeString()}</>
            ) : (
              <>Performance metrics for {team2 || "Team 2"}</>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fetchLatestStats(team2)}
            disabled={isRefreshing === team2 || !team2}
            className="text-xs"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing === team2 ? 'animate-spin' : ''}`} />
            {isRefreshing === team2 ? 'Refreshing...' : 'Real-time Update'}
          </Button>
        </div>
        
        {isRefreshing === team2 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Team 2 Stats - Similar to Team 1 */}
            <div className="space-y-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <Label htmlFor="team2-recent-wins" className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                  Recent Wins
                </Label>
                <Badge variant="outline" className="font-mono">
                  {team2RecentWins}/5
                </Badge>
              </div>
              
              <Slider
                id="team2-recent-wins-slider"
                min={0}
                max={5}
                step={1}
                value={[parseInt(team2RecentWins) || 0]}
                onValueChange={(value) => setTeam2RecentWins(value[0].toString())}
                className="py-2"
              />
              
              <Input
                id="team2-recent-wins"
                type="number"
                min="0"
                max="5"
                value={team2RecentWins}
                onChange={(e) => setTeam2RecentWins(e.target.value)}
                className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-1"
              />
            </div>
            
            <div className="space-y-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <Label htmlFor="team2-batting-avg" className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
                  Batting Average
                </Label>
                <div className="flex items-center">
                  {renderTrend(parseFloat(team2BattingAvg) || 0)}
                  <Badge variant="outline" className="font-mono ml-1">
                    {parseFloat(team2BattingAvg).toFixed(1)}
                  </Badge>
                </div>
              </div>
              
              <Input
                id="team2-batting-avg"
                type="number"
                min="0"
                step="0.01"
                value={team2BattingAvg}
                onChange={(e) => setTeam2BattingAvg(e.target.value)}
                className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
            
            <div className="space-y-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <Label htmlFor="team2-bowling-avg" className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <Target className="h-4 w-4 mr-1 text-red-500" />
                  Bowling Average
                </Label>
                <div className="flex items-center">
                  {renderTrend(35 - (parseFloat(team2BowlingAvg) || 0))}
                  <Badge variant="outline" className="font-mono ml-1">
                    {parseFloat(team2BowlingAvg).toFixed(1)}
                  </Badge>
                </div>
              </div>
              
              <Input
                id="team2-bowling-avg"
                type="number"
                min="0"
                step="0.01"
                value={team2BowlingAvg}
                onChange={(e) => setTeam2BowlingAvg(e.target.value)}
                className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default TeamStatsInput;
