
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { CricketGround } from '@/utils/supabaseClient';

interface VenueDetailsSectionProps {
  venueDetails: CricketGround;
}

const VenueDetailsSection: React.FC<VenueDetailsSectionProps> = ({ venueDetails }) => {
  return (
    <motion.div 
      className="mb-6 p-4 bg-blue-50/50 dark:bg-blue-900/50 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-blue-500" />
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Ground Details</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Dimensions: {venueDetails.width}m × {venueDetails.height}m</p>
          {venueDetails.rounded_rect && <p className="text-gray-600 dark:text-gray-400">Shape: Rounded Rectangle</p>}
          {venueDetails.odi_only && <p className="text-gray-600 dark:text-gray-400">ODI Only Ground</p>}
        </div>
        {(venueDetails.batting_record_name || venueDetails.bowling_record_name) && (
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {venueDetails.batting_record_name && (
              <p>Batting Record: {venueDetails.batting_record_name} - {venueDetails.batting_record_score}</p>
            )}
            {venueDetails.bowling_record_name && (
              <p>Bowling Record: {venueDetails.bowling_record_name} - {venueDetails.bowling_record_figures}</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VenueDetailsSection;
