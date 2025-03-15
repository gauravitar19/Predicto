import React from 'react';
import TeamSelector from '../TeamSelector';

interface TeamSelectionSectionProps {
  team1: string;
  setTeam1: (value: string) => void;
  team2: string;
  setTeam2: (value: string) => void;
  isDisabled?: boolean;
}

const TeamSelectionSection: React.FC<TeamSelectionSectionProps> = ({
  team1, setTeam1, team2, setTeam2, isDisabled = false
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <TeamSelector teamType="team1" value={team1} onChange={setTeam1} disabled={isDisabled} />
    <TeamSelector teamType="team2" value={team2} onChange={setTeam2} disabled={isDisabled} />
  </div>
);

export default TeamSelectionSection;
