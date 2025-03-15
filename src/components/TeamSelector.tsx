
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TeamSelectorProps {
  teamType: string;
  value: string;
  onChange: (value: string) => void;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({ teamType, value, onChange }) => {
  const teams = [
    "India", 
    "Australia", 
    "England", 
    "South Africa", 
    "New Zealand", 
    "West Indies", 
    "Pakistan", 
    "Sri Lanka", 
    "Bangladesh", 
    "Afghanistan"
  ];
  
  // Cricket teams with their main colors
  const teamColors: Record<string, { primary: string, secondary: string }> = {
    "India": { primary: "bg-blue-600", secondary: "bg-orange-500" },
    "Australia": { primary: "bg-yellow-400", secondary: "bg-green-600" },
    "England": { primary: "bg-blue-800", secondary: "bg-red-600" },
    "South Africa": { primary: "bg-green-600", secondary: "bg-yellow-400" },
    "New Zealand": { primary: "bg-black", secondary: "bg-gray-300" },
    "West Indies": { primary: "bg-burgundy-600", secondary: "bg-yellow-500" },
    "Pakistan": { primary: "bg-green-700", secondary: "bg-white" },
    "Sri Lanka": { primary: "bg-blue-600", secondary: "bg-yellow-500" },
    "Bangladesh": { primary: "bg-green-600", secondary: "bg-red-600" },
    "Afghanistan": { primary: "bg-red-600", secondary: "bg-green-700" }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`team-${teamType}`} className="font-medium text-gray-700 dark:text-gray-300">
        {teamType === "team1" ? "Team 1" : "Team 2"}
      </Label>
      
      <div className="relative">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger 
            id={`team-${teamType}`} 
            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
          >
            <SelectValue placeholder={`Select ${teamType === "team1" ? "first" : "second"} team`} />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team} value={team}>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ x: 2 }}
                >
                  {/* Team color indicator */}
                  {value === team && (
                    <div className="mr-2 flex">
                      <span className={`h-3 w-1.5 ${teamColors[team]?.primary || "bg-gray-400"} rounded-l`}></span>
                      <span className={`h-3 w-1.5 ${teamColors[team]?.secondary || "bg-gray-300"} rounded-r`}></span>
                    </div>
                  )}
                  {team}
                </motion.div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {value && (
          <motion.div 
            className="absolute right-10 top-1/2 -translate-y-1/2 flex"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className={`h-3 w-1.5 ${teamColors[value]?.primary || "bg-gray-400"} rounded-l`}></span>
            <span className={`h-3 w-1.5 ${teamColors[value]?.secondary || "bg-gray-300"} rounded-r`}></span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TeamSelector;
