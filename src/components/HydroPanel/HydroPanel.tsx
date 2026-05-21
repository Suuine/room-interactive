import React, { useState, useEffect } from 'react';
// @ts-ignore: CSS import without type declarations
import '../../../style/HydroPanel.css';
import { WeatherData, fetchWeatherData } from './weatherService';
import ThermostatControl from './ThermostatControl';
import WeatherDetails from './WeatherDetails';
import SunCycle from './SunCycle';

const HydroPanel: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        const data = await fetchWeatherData('Kyiv');
        setWeatherData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getWeatherData();
  }, []);

  if (loading) {
    return <div className="hydro-panel-container"><div className="hydro-loading">System Booting...</div></div>;
  }

  if (error || !weatherData) {
    return (
      <div className="hydro-panel-container">
        <div className="hydro-error">
          <p>System Error</p>
          <p style={{ fontSize: '14px', color: '#ff5555' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hydro-panel-container">
      <div className="hydro-header">
        <div className="hydro-title">HYDRO CENTER</div>
        <div className="hydro-time">{time}</div>
      </div>

      <ThermostatControl currentTemp={Math.round(weatherData.main.temp)} />
      
      <WeatherDetails data={weatherData} />

      <SunCycle data={weatherData} />
    </div>
  );
};

export default HydroPanel;
