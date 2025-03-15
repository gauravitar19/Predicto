
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sun, CloudRain, Thermometer, Percent, MapPin, RefreshCw, Cloud, CloudFog, CloudLightning, CloudSnow } from 'lucide-react';
import { WeatherData } from '@/utils/weatherApi';

interface WeatherInputProps {
  temperature: number;
  setTemperature: (value: number) => void;
  humidity: number;
  setHumidity: (value: number) => void;
  weatherCondition: string;
  setWeatherCondition: (value: string) => void;
  isAutoWeather?: boolean;
  weatherData?: WeatherData | null;
  isLoadingWeather?: boolean;
  onRefreshWeather?: () => void;
}

const WeatherInput: React.FC<WeatherInputProps> = ({
  temperature,
  setTemperature,
  humidity,
  setHumidity,
  weatherCondition,
  setWeatherCondition,
  isAutoWeather = false,
  weatherData = null,
  isLoadingWeather = false,
  onRefreshWeather
}) => {
  const weatherConditions = ["Sunny", "Cloudy", "Rainy", "Overcast", "Partly Cloudy", "Thunderstorm", "Foggy", "Snow", "Drizzle"];
  
  // Update local state when weather data changes
  useEffect(() => {
    if (isAutoWeather && weatherData) {
      setTemperature(weatherData.temperature);
      setHumidity(weatherData.humidity);
      setWeatherCondition(weatherData.condition);
    }
  }, [weatherData, isAutoWeather, setTemperature, setHumidity, setWeatherCondition]);
  
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'rainy':
        return <CloudRain className="h-4 w-4 text-blue-500" />;
      case 'cloudy':
        return <Cloud className="h-4 w-4 text-gray-500" />;
      case 'thunderstorm':
        return <CloudLightning className="h-4 w-4 text-purple-500" />;
      case 'foggy':
        return <CloudFog className="h-4 w-4 text-gray-400" />;
      case 'snow':
        return <CloudSnow className="h-4 w-4 text-blue-300" />;
      case 'drizzle':
        return <CloudRain className="h-4 w-4 text-blue-400" />;
      default:
        return <Cloud className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 relative p-5 glass-panel rounded-xl">
      <div className="absolute -top-3 left-4">
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-cricket-100 text-cricket-800 dark:bg-cricket-900 dark:text-cricket-100">
          Weather Conditions
          {isAutoWeather && weatherData?.location && (
            <span className="ml-2 opacity-75">• {weatherData.location}</span>
          )}
        </span>
      </div>
      
      {isAutoWeather && weatherData && (
        <div className="absolute top-2 right-4 flex items-center text-xs text-gray-500">
          <MapPin className="h-3 w-3 mr-1" />
          Live Weather
          {onRefreshWeather && (
            <button 
              onClick={onRefreshWeather}
              className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full focus:outline-none"
              disabled={isLoadingWeather}
            >
              <RefreshCw className={`h-3 w-3 ${isLoadingWeather ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center font-medium text-gray-700 dark:text-gray-300">
            <span className="mr-2">Weather</span>
          </Label>
          <Select 
            value={weatherCondition} 
            onValueChange={setWeatherCondition}
            disabled={isAutoWeather && isLoadingWeather}
          >
            <SelectTrigger className="w-full border bg-white dark:bg-gray-800">
              <SelectValue placeholder="Select weather condition" />
            </SelectTrigger>
            <SelectContent>
              {weatherConditions.map((condition) => (
                <SelectItem key={condition} value={condition}>
                  <motion.div 
                    className="flex items-center"
                    whileHover={{ x: 2 }}
                  >
                    {getWeatherIcon(condition)}
                    <span className="ml-2">{condition}</span>
                  </motion.div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center font-medium text-gray-700 dark:text-gray-300">
            <Thermometer className="h-4 w-4 mr-2 text-red-500" />
            <span>Temperature: {temperature}°C</span>
          </Label>
          <Slider
            value={[temperature]}
            min={0}
            max={45}
            step={1}
            onValueChange={(value) => setTemperature(value[0])}
            className="py-2"
            disabled={isAutoWeather && isLoadingWeather}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center font-medium text-gray-700 dark:text-gray-300">
            <Percent className="h-4 w-4 mr-2 text-blue-500" />
            <span>Humidity: {humidity}%</span>
          </Label>
          <Slider
            value={[humidity]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setHumidity(value[0])}
            className="py-2"
            disabled={isAutoWeather && isLoadingWeather}
          />
        </div>
      </div>
      
      {/* Visual weather representation */}
      <motion.div 
        className="absolute -right-3 -top-3 opacity-70"
        animate={{ 
          rotate: weatherCondition === 'Sunny' ? [0, 5, 0, -5, 0] : 0,
          y: weatherCondition === 'Rainy' ? [0, -2, 0, -2, 0] : 0 
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        {getWeatherIcon(weatherCondition)}
      </motion.div>
    </div>
  );
};

export default WeatherInput;
