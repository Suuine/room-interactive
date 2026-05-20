import React, { useState, useEffect, useRef } from 'react';

interface ThermostatControlProps {
  currentTemp: number;
}

const ThermostatControl: React.FC<ThermostatControlProps> = ({ currentTemp }) => {
  const [targetTemp, setTargetTemp] = useState<number>(22);
  const [rotation, setRotation] = useState<number>(0);
  const dialRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  useEffect(() => {
    if (targetTemp) {
      const minTemp = 10;
      const maxTemp = 35;
      const progress = (targetTemp - minTemp) / (maxTemp - minTemp);
      setRotation(progress * 270 - 135); 
    }
  }, [targetTemp]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    updateRotation(e);
    if (dialRef.current) {
        dialRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) {
      updateRotation(e);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    if (dialRef.current) {
        dialRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const updateRotation = (e: React.PointerEvent) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    let rad = Math.atan2(deltaY, deltaX);
    let deg = rad * (180 / Math.PI) + 90; 
    
    if (deg < -180) deg += 360;
    if (deg > 180) deg -= 360;

    if (deg > 135) deg = 135;
    if (deg < -135) deg = -135;

    setRotation(deg);
    const minTemp = 10;
    const maxTemp = 35;
    const progress = (deg + 135) / 270;
    setTargetTemp(Math.round(minTemp + progress * (maxTemp - minTemp)));
  };

  return (
    <div className="hydro-section thermostat-container">
      <div 
        className="thermostat-dial"
        ref={dialRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div 
          className="thermostat-indicator" 
          style={{ transform: `rotate(${rotation}deg) translateY(-110px)` }}
        ></div>
        <div className="thermostat-inner">
          <div className="thermostat-temp">{targetTemp}°</div>
          <div className="thermostat-label">TARGET</div>
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#a0a5ac' }}>
            Inside: {currentTemp}°C
          </div>
        </div>
      </div>
      
      <div className="thermostat-controls">
        <button 
          className="thermostat-btn" 
          onClick={() => setTargetTemp(prev => Math.max(10, prev - 1))}
        >-</button>
        <button 
          className="thermostat-btn" 
          onClick={() => setTargetTemp(prev => Math.min(35, prev + 1))}
        >+</button>
      </div>
    </div>
  );
};

export default ThermostatControl;
