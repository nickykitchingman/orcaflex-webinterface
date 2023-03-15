import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary'

import Header from './components/Header'
import Router from './components/Router'
import { BoundaryError } from './pages/Error'
import userState from './UserState'

const Home = () => {
    const { getUID, setUID, signedIn } = userState();

    return (        
        <div>       
            <ErrorBoundary FallbackComponent={BoundaryError}>
                <Header getUID={getUID} setUID={setUID} signedIn={signedIn} />            
                <Router getUID={getUID} setUID={setUID} signedIn={signedIn} />
            </ErrorBoundary>
        </div>
    );
}

export default Home;