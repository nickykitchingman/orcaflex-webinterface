import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { ThreeDots } from 'react-loader-spinner';

import './Loading.css';

export default function Loading() {
    const { promiseInProgress } = usePromiseTracker(); 

    return (
        promiseInProgress &&
        <div  className="loader"><ThreeDots color="var(--color-1-light)"/></div>
    )
}