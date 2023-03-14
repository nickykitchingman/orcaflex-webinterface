import React from 'react';
import { ErrorBoundary } from 'react-error-boundary'

import Header from './components/Header'
import Router from './components/Router'
import { BoundaryError } from './pages/Error'

const Home = () => {
    return (        
        <div>       
            <ErrorBoundary FallbackComponent={BoundaryError}>
                <Header />            
                <Router />
            </ErrorBoundary>
        </div>
    );
}

export default Home;