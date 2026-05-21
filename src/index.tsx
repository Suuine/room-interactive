import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Cassete from './Cassete';
import Computer from './components/Computer/Computer';
// @ts-ignore: CSS import without type declarations
import './index.css';
import GydroCenter from './components/HydroPanel/HydroPanel';

type View = 'home' | 'computer' | 'cassete' | 'hydro';

function App() {
  const [view, setView] = useState<View>('home');

  const renderView = () => {
    switch (view) {
      case 'computer': return <Computer />;
      case 'cassete': return <Cassete />;
      case 'hydro': return <GydroCenter />;
      default:
        return (
          <div className="home-screen">
            <img src="../room.png" alt="Room" className="room-bg" />
            
            <div className="home-zones">
              {/* LEFT - HydroPanel */}
              <div className="home-zone zone-hydro" onClick={() => setView('hydro')}>
                <div className="zone-inner">
                  <span className="zone-label">HydroPanel</span>
                  <div className="zone-icon">💧</div>
                </div>
              </div>

              {/* CENTER - Computer */}
              <div className="home-zone zone-computer" onClick={() => setView('computer')}>
                <div className="zone-inner">
                  <span className="zone-label">Computer</span>
                  <div className="zone-icon">🖥</div>
                </div>
              </div>

              {/* RIGHT - Cassete */}
              <div className="home-zone zone-cassete" onClick={() => setView('cassete')}>
                <div className="zone-inner">
                  <span className="zone-label">Cassete</span>
                  <div className="zone-icon">📼</div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      {view !== 'home' && (
        <button className="back-btn" onClick={() => setView('home')}>
          ← Back
        </button>
      )}
      {renderView()}
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);