
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Mock data for development
const teamStatsDatabase = {
  "India": {
    recentWins: 4,
    battingAvg: 36.8,
    bowlingAvg: 26.2,
    lastUpdated: new Date().toISOString()
  },
  "Australia": {
    recentWins: 3,
    battingAvg: 33.5,
    bowlingAvg: 27.4,
    lastUpdated: new Date().toISOString()
  },
  "England": {
    recentWins: 2,
    battingAvg: 31.2,
    bowlingAvg: 29.8,
    lastUpdated: new Date().toISOString()
  },
  "South Africa": {
    recentWins: 3,
    battingAvg: 30.5,
    bowlingAvg: 28.1,
    lastUpdated: new Date().toISOString()
  },
  "New Zealand": {
    recentWins: 3,
    battingAvg: 32.7,
    bowlingAvg: 26.9,
    lastUpdated: new Date().toISOString()
  },
  "Pakistan": {
    recentWins: 2,
    battingAvg: 29.8,
    bowlingAvg: 31.2,
    lastUpdated: new Date().toISOString()
  },
  "West Indies": {
    recentWins: 1,
    battingAvg: 27.3,
    bowlingAvg: 33.5,
    lastUpdated: new Date().toISOString()
  },
  "Sri Lanka": {
    recentWins: 2,
    battingAvg: 28.6,
    bowlingAvg: 32.7,
    lastUpdated: new Date().toISOString()
  },
  "Bangladesh": {
    recentWins: 1,
    battingAvg: 26.4,
    bowlingAvg: 34.8,
    lastUpdated: new Date().toISOString()
  },
  "Afghanistan": {
    recentWins: 2,
    battingAvg: 25.9,
    bowlingAvg: 30.2,
    lastUpdated: new Date().toISOString()
  }
};

// Helper function to add random variation to stats to simulate real-time updates
function getUpdatedTeamStats(teamName: string) {
  if (!teamStatsDatabase[teamName]) {
    return null;
  }
  
  const baseStats = teamStatsDatabase[teamName];
  
  // Add slight variations to simulate real-time updates
  const battingVariation = (Math.random() * 2 - 1) * 1.5; // -1.5 to +1.5
  const bowlingVariation = (Math.random() * 2 - 1) * 1.2; // -1.2 to +1.2
  
  // Random chance for recent wins to change
  const winsChange = Math.random() > 0.7 ? Math.floor(Math.random() * 3) - 1 : 0;
  const newWins = Math.max(0, Math.min(5, baseStats.recentWins + winsChange));
  
  const updatedStats = {
    recentWins: newWins,
    battingAvg: parseFloat((baseStats.battingAvg + battingVariation).toFixed(1)),
    bowlingAvg: parseFloat((baseStats.bowlingAvg + bowlingVariation).toFixed(1)),
    lastUpdated: new Date().toISOString()
  };
  
  // Update our in-memory database for future requests
  teamStatsDatabase[teamName] = updatedStats;
  
  return updatedStats;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204 
    });
  }
  
  try {
    const url = new URL(req.url);
    
    // Handle team stats request
    if (req.method === 'GET' && url.pathname === '/cricket-stats/team') {
      const teamName = url.searchParams.get('team');
      
      if (!teamName) {
        return new Response(
          JSON.stringify({ error: 'Team name is required' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }
      
      console.log(`Fetching stats for team: ${teamName}`);
      
      // In a production environment, you would fetch this data from a real sports API
      // For this example, we'll use our simulated data
      const teamStats = getUpdatedTeamStats(teamName);
      
      if (!teamStats) {
        return new Response(
          JSON.stringify({ error: 'Team not found' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          team: teamName,
          stats: teamStats,
          dataSource: 'cricket-stats-api'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }
    
    // Handle teams list request
    if (req.method === 'GET' && url.pathname === '/cricket-stats/teams') {
      const teamsList = Object.keys(teamStatsDatabase);
      
      return new Response(
        JSON.stringify({ teams: teamsList }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }
    
    // Handle unknown paths
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404 
      }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})
