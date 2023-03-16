import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary'

import Header from './components/Header'
import Router from './components/Router'
import { BoundaryError } from './pages/Error'
import userState from './UserState'

const Home = () => {
    const { getToken, setToken, signedIn } = userState();

    return (        
        <div>       
            <ErrorBoundary FallbackComponent={BoundaryError}>
                <Header getToken={getToken} setToken={setToken} signedIn={signedIn} />            
                <Router getToken={getToken} setToken={setToken} signedIn={signedIn} />
            </ErrorBoundary>
        </div>
    );
}

export default Home;