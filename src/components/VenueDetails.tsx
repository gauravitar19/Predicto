
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { CricketGround } from '@/utils/supabaseClient';
import { MapPin, Calendar, Trophy, ArrowUp, Home } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface VenueDetailsProps {
  venue: CricketGround;
}

const VenueDetails: React.FC<VenueDetailsProps> = ({ venue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4"
    >
      <Card className="overflow-hidden border-cricket-100 dark:border-cricket-800">
        <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 p-3">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{venue.ground_long}</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 ml-7">
            <span className="font-medium">{venue.country}</span>
          </p>
        </div>
        
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <Home className="h-4 w-4 text-gray-500 mr-2" />
                <h4 className="text-sm font-medium">Venue Specifications</h4>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Dimensions:</span>
                  <span className="font-medium">{venue.width}m × {venue.height}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Ground Size:</span>
                  <Badge variant={getGroundSizeVariant(venue.width * venue.height)}>
                    {getGroundSizeLabel(venue.width * venue.height)}
                  </Badge>
                </div>
                
                {venue.odi_only && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                      ODI Only Venue
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Trophy className="h-4 w-4 text-amber-500 mr-2" />
                <h4 className="text-sm font-medium">Notable Records</h4>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm">
                {venue.batting_record_name ? (
                  <div className="mb-2">
                    <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                      <ArrowUp className="h-3 w-3 mr-1" /> 
                      Highest Individual Score
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {venue.batting_record_name} ({venue.batting_record_country})
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>vs {venue.batting_record_against}</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400">{venue.batting_record_date}</span>
                      </div>
                    </div>
                    <div className="mt-1">
                      <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                        {venue.batting_record_score}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 text-xs mb-2">No batting records available</div>
                )}
                
                {venue.batting_record_name && venue.bowling_record_name && (
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2"></div>
                )}
                
                {venue.bowling_record_name ? (
                  <div>
                    <div className="flex items-center text-xs text-red-600 dark:text-red-400 font-medium mb-1">
                      <ArrowUp className="h-3 w-3 mr-1" /> 
                      Best Bowling Figures
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {venue.bowling_record_name} ({venue.bowling_record_country})
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>vs {venue.bowling_record_against}</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400">{venue.bowling_record_date}</span>
                      </div>
                    </div>
                    <div className="mt-1">
                      <Badge className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800">
                        {venue.bowling_record_figures}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 text-xs">No bowling records available</div>
                )}
              </div>
            </div>
          </div>
          
          {venue.notes && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
              <p className="italic">{venue.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Helper functions to categorize ground size
const getGroundSizeLabel = (area: number): string => {
  if (area > 24000) return 'Large';
  if (area > 20000) return 'Medium-Large';
  if (area > 16000) return 'Medium';
  return 'Small';
};

const getGroundSizeVariant = (area: number): "default" | "secondary" | "destructive" | "outline" => {
  if (area > 24000) return 'default';
  if (area > 20000) return 'secondary';
  if (area > 16000) return 'outline';
  return 'destructive';
};

export default VenueDetails;
