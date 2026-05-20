import React, { useState, useEffect, use } from 'react';
// @ts-ignore: CSS import without type declarations
import './style/GydroCenter.css';

interface ScheduleItem {
  id: number;
  day: string;
  temp: string;
  time1: string;
  time2: string;
  isActive: boolean;
}

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
}

const API_KEY = '7358c688cae82577e18a3977c5206535';
const CITY_NAME = 'Kyiv';

const GydroCenter: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<number>(20);
  
  const [heatingStatus, setHeatingStatus] = useState<string>('');
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  const possibleDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const possibleTemps = ['18°C', '19°C', '20°C', '21°C', 'OFF'];
  const possibleTimeRanges1 = ['6AM-10AM', '9AM-1PM', '8AM-12PM', '7AM-11AM'];
  const possibleTimeRanges2 = ['5PM-11:30PM', '6PM-10PM', '4PM-9PM', 'OFF'];

  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    { id: 1, day: 'WEEKDAYS', temp: '18°C', time1: '6AM-10AM', time2: '5PM-11:30PM', isActive: false },
    { id: 2, day: 'DAY OFF', temp: '19°C', time1: '9AM-1PM', time2: '5PM-11:30PM', isActive: true },
  ]);

  const [isDehumidifierActive, setIsDehumidifierActive] = useState(true);

  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
        setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000); // Update every second
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: WeatherData = await response.json();
        setWeatherData(data);
        setTemperature(Math.round(data.main.temp));
      } catch (error: any) {
        setWeatherError(error.message);
        console.error(error);
      } finally {
        setIsLoadingWeather(false);
      }
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    if (weatherData) {
      const currentTemp = Math.round(weatherData.main.temp);
      const desired = temperature;
      const threshold = 1;

      if (currentTemp < desired - threshold) {
        setHeatingStatus('Heating up to desired temperature....');
        const tempDiff = desired - currentTemp;
        const maxRange = 10;
        const progress = Math.min(100, Math.max(0, (maxRange - tempDiff) / maxRange * 100));
        setProgressPercentage(Math.round(progress));
      } else if (currentTemp > desired + threshold) {
        setHeatingStatus('Cooling down to desired temperature....');
        const tempDiff = currentTemp - desired;
        const maxRange = 10;
        const progress = Math.min(100, Math.max(0, (maxRange - tempDiff) / maxRange * 100));
        setProgressPercentage(Math.round(progress));
      } else {
        setHeatingStatus('Optimal temperature reached.');
        setProgressPercentage(100);
      }
    }
  }, [weatherData, temperature]);

  const incrementTemperature = () => {
    setTemperature(prev => prev + 1);
  };

  const decrementTemperature = () => {
    setTemperature(prev => prev - 1);
  };

  const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const handleAddClick = () => {
    const newId = Math.max(...scheduleItems.map(item => item.id), 0) + 1;
    const newDay = getRandomElement(possibleDays);
    const newTemp = getRandomElement(possibleTemps);
    const newTime1 = getRandomElement(possibleTimeRanges1);
    const newTime2 = getRandomElement(possibleTimeRanges2);

    const newItem: ScheduleItem = {
      id: newId,
      day: newDay,
      temp: newTemp,
      time1: newTime1,
      time2: newTime2,
      isActive: Math.random() > 0.5,
    };

    setScheduleItems(prevItems => [...prevItems.slice(1), newItem]);
  };

  const handleScheduleToggle = (id: number) => {
    setScheduleItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  const handleDehumidifierToggle = () => {
    setIsDehumidifierActive(prev => !prev);
  };

  const areRadiatorsOn = weatherData && weatherData.main.temp < temperature - 1;

  if (isLoadingWeather) {
    return (
      <div className="gydro-center-container">
        <p>Loading weather data...</p>
      </div>
    );
  }

  if (weatherError) {
    return (
      <div className="gydro-center-container">
        <p>Error fetching weather data: {weatherError}</p>
      </div>
    );
  }

  return (
    <div className="gydro-center-container">
      <div className="gydro-center-header">
        <div className="time">{time}</div>
        <div className="status-icons">
          {weatherData && <span>💨 {weatherData.wind.speed.toFixed(1)} m/s</span>}
        </div>
        <div className="title">Aeonik Fono</div>
        <div className="menu-icon">☰</div>
      </div>

      <div className="temp-control-card neumorphic-card">
        <div className="temp-display">
          <span className="temp-value">{temperature}°C</span>
          <div className="temp-buttons">
            <button className="temp-btn" onClick={incrementTemperature}>+</button>
            <button className="temp-btn" onClick={decrementTemperature}>-</button>
          </div>
        </div>
        <div className="temp-status">
          {heatingStatus}
          <div className="progress-bar">
            <div className="progress-circle neumorphic-card">{progressPercentage}%</div>
          </div>
        </div>
      </div>

      <div className="info-cards-wrapper">
        <div className="info-card neumorphic-card">
          <div className="card-header">
            RADIATORS <span className="edit-link">Edit</span>
          </div>
          <div className="radiator-graphic"></div>
          <div className="card-data">
            <div>WATER <span className="value">67°C</span></div>
            <div>PRESSURE <span className="value">1.7bar</span></div>
            <div>TIMER <span className="value">{areRadiatorsOn ? 'ON' : 'OFF'}</span></div>
          </div>
        </div>

        <div className="info-card neumorphic-card">
          <div className="card-header">PANELS</div>
          <div className="panels-graphic">
            <div>WEST<br/>67%</div>
            <div>EAST<br/>72%</div>
          </div>
          <div className="card-data">
            <div>CAPACITY <span className="value">320kWh</span></div>
            <div>WEEKLY <span className="value">+1.6%</span></div>
            <div>TOTAL YIELD <span className="value">190kWh</span></div>
          </div>
        </div>
      </div>

      <div className="schedule-section neumorphic-card">
        <div className="add-button neumorphic-inset" onClick={handleAddClick}>+ADD</div>
        {scheduleItems.map(item => (
          <div className="schedule-item" key={item.id}>
            <div>{item.day}</div>
            <div>{item.temp}</div>
            <div>{item.time1}</div>
            <div>{item.time2}</div>
            <div
              className={`toggle-switch ${item.isActive ? 'active' : ''}`}
              onClick={() => handleScheduleToggle(item.id)}
            ></div>
          </div>
        ))}
      </div>

      <div className="dehumidifier-toggle">
        DEHUMIDIFIER ON
        <div
          className={`toggle-switch ${isDehumidifierActive ? 'active' : ''}`}
          onClick={handleDehumidifierToggle}
        ></div>
      </div>
    </div>
  );
};

export default GydroCenter;
