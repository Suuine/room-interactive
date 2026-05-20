import React from 'react';
import { WeatherData } from './weatherService';

interface WeatherDetailsProps {
  data: WeatherData;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ data }) => {
  return (
    <div className="hydro-section">
      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#000000' }}>{data.name}, {data.sys.country}</h3>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#787e86', textTransform: 'capitalize' }}>
            {data.weather[0].description}
          </p>
        </div>
        <img 
          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} 
          alt="weather icon" 
          style={{ width: '60px', height: '60px', filter: 'drop-shadow(0 0 10px rgba(52, 17, 159, 1))' }}
        />
      </div>

      <div className="weather-details-grid">
        <div className="weather-metric">
          <div className="metric-label">🌡️ Feels Like</div>
          <div className="metric-value">{Math.round(data.main.feels_like)}°C</div>
        </div>
        <div className="weather-metric">
          <div className="metric-label">💧 Humidity</div>
          <div className="metric-value metric-highlight">{data.main.humidity}%</div>
        </div>
        <div className="weather-metric">
          <div className="metric-label">🔽 Pressure</div>
          <div className="metric-value">{data.main.pressure} hPa</div>
        </div>
        <div className="weather-metric">
          <div className="metric-label">💨 Wind</div>
          <div className="metric-value">{data.wind.speed} m/s</div>
        </div>
        <div className="weather-metric">
          <div className="metric-label">👁️ Visibility</div>
          <div className="metric-value">{(data.visibility / 1000).toFixed(1)} km</div>
        </div>
        <div className="weather-metric">
          <div className="metric-label">☁️ Clouds</div>
          <div className="metric-value">{data.clouds.all}%</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
