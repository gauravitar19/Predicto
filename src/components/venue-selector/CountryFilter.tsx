
import React from 'react';
import { Globe } from 'lucide-react';
import { CricketGround } from '@/utils/supabaseClient';

interface CountryFilterProps {
  countries: string[];
  selectedCountry: string | null;
  onCountrySelect: (country: string) => void;
  getVenueCountByCountry: (country: string) => number;
}

const CountryFilter: React.FC<CountryFilterProps> = ({
  countries,
  selectedCountry,
  onCountrySelect,
  getVenueCountByCountry
}) => {
  if (countries.length === 0) return null;

  return (
    <div className="p-2 border-b border-gray-100 dark:border-gray-700">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center">
        <Globe className="h-3 w-3 mr-1" />
        Filter by country:
      </p>
      <div className="flex flex-wrap gap-1">
        {countries.map(country => (
          <button
            key={country}
            onClick={() => onCountrySelect(country)}
            className={`text-xs px-2 py-1 rounded-full ${
              selectedCountry === country 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {country} ({getVenueCountByCountry(country)})
          </button>
        ))}
      </div>
    </div>
  );
};

export default CountryFilter;
