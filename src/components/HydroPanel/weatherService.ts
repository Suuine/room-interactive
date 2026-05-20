export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  visibility: number;
  clouds: {
    all: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  name: string;
  dt: number;
}

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

export const fetchWeatherData = async (city: string = 'Kyiv'): Promise<WeatherData> => {
  if (!API_KEY) {
    throw new Error('API key is missing in .env file (REACT_APP_OPENWEATHER_API_KEY)');
  }
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
  if (!res.ok) {
    throw new Error(`Failed to fetch weather: ${res.statusText}`);
  }
  return res.json();
};
