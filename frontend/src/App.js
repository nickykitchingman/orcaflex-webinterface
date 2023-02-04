import React from 'react';
import { ErrorBoundary } from 'react-error-boundary'

import Header from './components/Header'
import Router from './components/Router'
import Error from './pages/Error'

const Home = () => {
    return (        
        <div>       
            <ErrorBoundary FallbackComponent={Error}>
                <Header />            
                <Router />
            </ErrorBoundary>
        </div>
    );
}

export default Home;