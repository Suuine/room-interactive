import React from 'react';
import { WeatherData } from './weatherService';

interface SunCycleProps {
  data: WeatherData;
}

const formatTime = (unixTs: number) => {
  const date = new Date(unixTs * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const SunCycle: React.FC<SunCycleProps> = ({ data }) => {
  const { sunrise, sunset } = data.sys;
  const now = Math.floor(Date.now() / 1000);
  
  // Calculate sun position percentage (0 to 100)
  let sunProgress = 0;
  if (now > sunrise && now < sunset) {
    sunProgress = ((now - sunrise) / (sunset - sunrise)) * 100;
  } else if (now >= sunset) {
    sunProgress = 100;
  }

  return (
    <div className="bottom-panels">
      <div className="hydro-section mini-panel">
        <div style={{ fontSize: '12px', color: '#787e86' }}>SUNRISE</div>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatTime(sunrise)}</div>
      </div>
      
      <div className="hydro-section mini-panel" style={{ padding: '10px' }}>
        <div style={{ fontSize: '12px', color: '#787e86' }}>SUN CYCLE</div>
        <div className="sun-cycle">
          <div className="sun-arc"></div>
          <div 
            className="sun-indicator"
            style={{ 
              left: `${10 + (sunProgress * 0.8)}%`, 
              top: `${Math.sin((sunProgress / 100) * Math.PI) * -40 + 40}px` 
            }}
          ></div>
        </div>
      </div>

      <div className="hydro-section mini-panel">
        <div style={{ fontSize: '12px', color: '#787e86' }}>SUNSET</div>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatTime(sunset)}</div>
      </div>
    </div>
  );
};

export default SunCycle;
