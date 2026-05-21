import React, { useState } from 'react';
import Screen from './Screen';
import MainScreen from './MainScreen';

function Computer() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div className='computer'>
            {isLoggedIn ? (
                <Screen />
            ) : (
                <MainScreen 
                    username='Elionor' 
                    onAuthenticated={() => setIsLoggedIn(true)} 
                />
            )}
        </div>
    );
}

export default Computer;