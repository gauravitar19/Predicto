import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LiveMatch, getCurrentMatches } from '@/utils/cricketDataApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, RefreshCcw } from 'lucide-react';

interface LiveMatchesSectionProps {
  onMatchSelect?: (matchId: string) => void;
}

const LiveMatchesSection: React.FC<LiveMatchesSectionProps> = ({ onMatchSelect }) => {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('ongoing');

  const { 
    data: matches, 
    isLoading, 
    error, 
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['liveMatches'],
    queryFn: getCurrentMatches,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const ongoingMatches = matches?.filter(match => match.matchStarted && !match.matchEnded) || [];
  const upcomingMatches = matches?.filter(match => !match.matchStarted) || [];
  const completedMatches = matches?.filter(match => match.matchEnded) || [];

  // Auto-select the first match if none selected
  useEffect(() => {
    if (matches?.length && !selectedMatchId) {
      setSelectedMatchId(matches[0].id);
    }
  }, [matches, selectedMatchId]);

  const getMatchesByTab = () => {
    switch (activeTab) {
      case 'ongoing':
        return ongoingMatches;
      case 'upcoming':
        return upcomingMatches;
      case 'completed':
        return completedMatches;
      default:
        return ongoingMatches;
    }
  };

  const formatScore = (score: LiveMatch['score'][0] | undefined) => {
    if (!score) return 'Yet to bat';
    return `${score.r}/${score.w} (${score.o} ov)`;
  };

  const getMatchStatusColor = (match: LiveMatch) => {
    if (!match.matchStarted) return 'bg-blue-500';
    if (match.matchEnded) return 'bg-gray-500';
    return 'bg-green-500 animate-pulse';
  };

  const handleMatchClick = (match: LiveMatch) => {
    setSelectedMatchId(match.id);
    if (onMatchSelect) {
      onMatchSelect(match.id);
    }
  };

  const renderMatchCards = () => {
    const matchesToRender = getMatchesByTab();
    
    if (isLoading) {
      return Array(3).fill(0).map((_, index) => (
        <Card key={index} className="mb-4">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      ));
    }

    if (error) {
      return (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <p className="text-red-500">Error loading matches. Please try again.</p>
            <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-2">
              Retry
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (matchesToRender.length === 0) {
      return (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">No {activeTab} matches found.</p>
          </CardContent>
        </Card>
      );
    }

    return matchesToRender.map((match) => (
      <Card 
        key={match.id} 
        className={`mb-4 cursor-pointer hover:border-blue-300 transition-colors ${selectedMatchId === match.id ? 'border-blue-500' : ''}`} 
        onClick={() => handleMatchClick(match)}
      >
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {match.name}
          </CardTitle>
          <Badge variant="outline" className={`text-xs ${getMatchStatusColor(match)}`}>
            {match.status}
          </Badge>
        </CardHeader>
        <CardContent>
          {match.teamInfo?.map((team, index) => (
            <div key={team.name} className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {team.img && (
                  <img src={team.img} alt={team.name} className="w-6 h-6 mr-2" />
                )}
                <span className="font-medium">{team.name}</span>
              </div>
              <span className="text-right">
                {formatScore(match.score?.[index])}
              </span>
            </div>
          ))}
        </CardContent>
        <CardFooter className="pt-0 text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" /> {new Date(match.dateTimeGMT).toLocaleString()}
        </CardFooter>
      </Card>
    ));
  };

  return (
    <div className="live-matches-container">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Cricket Updates</h2>
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          size="sm"
          disabled={isRefetching}
        >
          <RefreshCcw className={`w-4 h-4 mr-1 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <Tabs defaultValue="ongoing" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="ongoing" className="flex-1">
            Live
            {ongoingMatches.length > 0 && (
              <Badge variant="outline" className="ml-2 bg-green-500">{ongoingMatches.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex-1">
            Upcoming
            {upcomingMatches.length > 0 && (
              <Badge variant="outline" className="ml-2">{upcomingMatches.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">
            Completed
            {completedMatches.length > 0 && (
              <Badge variant="outline" className="ml-2">{completedMatches.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ongoing" className="mt-0">
          {renderMatchCards()}
        </TabsContent>
        <TabsContent value="upcoming" className="mt-0">
          {renderMatchCards()}
        </TabsContent>
        <TabsContent value="completed" className="mt-0">
          {renderMatchCards()}
        </TabsContent>
      </Tabs>

      {selectedMatchId && onMatchSelect && (
        <div className="mt-4 text-center">
          <Button 
            variant="default" 
            onClick={() => onMatchSelect(selectedMatchId)}
            className="bg-cricket-600 hover:bg-cricket-700"
          >
            Use Selected Match for Prediction
          </Button>
        </div>
      )}
    </div>
  );
};

export default LiveMatchesSection; 