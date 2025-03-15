
import { useToast } from "@/hooks/use-toast";

// Weather data interface
export interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  icon: string;
  location: string;
}

// Default weather data
export const defaultWeather: WeatherData = {
  temperature: 25,
  humidity: 50,
  condition: "Sunny",
  icon: "01d",
  location: ""
};

// Convert OpenWeatherMap condition codes to our simplified conditions
const mapWeatherCondition = (weatherId: number): string => {
  // Weather condition mapping based on OpenWeatherMap API codes
  // https://openweathermap.org/weather-conditions
  if (weatherId >= 200 && weatherId < 300) return "Thunderstorm";
  if (weatherId >= 300 && weatherId < 400) return "Drizzle";
  if (weatherId >= 500 && weatherId < 600) return "Rainy";
  if (weatherId >= 600 && weatherId < 700) return "Snow";
  if (weatherId >= 700 && weatherId < 800) return "Foggy";
  if (weatherId === 800) return "Sunny";
  if (weatherId > 800) return "Cloudy";
  return "Sunny"; // Default
};

// Fetch weather data for a location
export const fetchWeatherForLocation = async (
  location: string, 
  country: string
): Promise<WeatherData> => {
  try {
    // If no location provided, return default weather
    if (!location) {
      console.log("No location provided for weather data");
      return defaultWeather;
    }

    const searchQuery = `${location},${country}`;
    console.log(`Fetching weather for: ${searchQuery}`);

    // Using OpenWeatherMap API (free tier)
    const API_KEY = "9de243494c0b295cca9337e1e96b00e2"; // This is a free demo key
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        searchQuery
      )}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log("Weather data received:", data);

    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      condition: mapWeatherCondition(data.weather[0].id),
      icon: data.weather[0].icon,
      location: data.name
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    // Return default weather on error
    return {
      ...defaultWeather,
      location: location
    };
  }
};

// This hook manages weather data fetching
export const useWeatherData = () => {
  const { toast } = useToast();

  const fetchWeatherData = async (venue: string, country: string): Promise<WeatherData> => {
    try {
      const weatherData = await fetchWeatherForLocation(venue, country);
      return weatherData;
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      toast({
        title: "Weather data unavailable",
        description: "Using default weather conditions",
        variant: "destructive"
      });
      return defaultWeather;
    }
  };

  return { fetchWeatherData };
};
