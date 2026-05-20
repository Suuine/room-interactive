import React, { useState } from 'react';
// import MainScrin from './components/MainScrin';
// import Screen from './components/Screen';

import GydroCenter from './GydroCenter'; // Import the new GydroCenter component

function Computer() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Keep state, but it won't be used for now

    return (
        <div className='computer'>
            {/* Render GydroCenter directly for visualization */}
            <GydroCenter />
        </div>
    );
}

export default Computer;