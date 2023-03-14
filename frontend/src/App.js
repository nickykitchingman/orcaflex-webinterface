import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary'

import Header from './components/Header'
import Router from './components/Router'
import { BoundaryError } from './pages/Error'
import userState from './UserState'

const Home = () => {
    const { getState, setState } = userState();

    return (        
        <div>       
            <ErrorBoundary FallbackComponent={BoundaryError}>
                <Header getState={getState} setState={setState} />            
                <Router getState={getState} setState={setState} />
            </ErrorBoundary>
        </div>
    );
}

export default Home;