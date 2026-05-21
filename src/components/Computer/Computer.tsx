import React, { useState } from 'react';
import Screen from './Screen'; // Import the new MainScreen component

function Computer() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Keep state, but it won't be used for now

    return (
        <div className='computer'>
            <Screen />
        </div>
    );
}

export default Computer;