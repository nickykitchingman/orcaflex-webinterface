import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { ThreeDots } from 'react-loader-spinner';

import './LoadingDots.css';

export default function LoadingDots(props) {
    const { promiseInProgress } = usePromiseTracker({area: props.area}); 

    return (
        promiseInProgress &&
        <div  className="loader"><ThreeDots color="var(--color-1-light)"/></div>
    )
}