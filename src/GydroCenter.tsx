import React from 'react';
import HydroPanel from './components/HydroPanel/HydroPanel';
// @ts-ignore: CSS import without type declarations
import './style/GydroCenter.css';

const GydroCenter: React.FC = () => {
  return (
    <div className="gydro-center-container">
      <HydroPanel />
    </div>
  );
};

export default GydroCenter;
