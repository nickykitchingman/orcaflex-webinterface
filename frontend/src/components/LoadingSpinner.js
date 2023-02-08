import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { Oval } from 'react-loader-spinner';


export default function LoadingSpinner(props) {
    const { promiseInProgress } = usePromiseTracker({area: props.area}); 

    return (
        promiseInProgress &&
        <div  className="loader"><Oval width="100%" height="100%" color="var(--color-notice)" secondaryColor="var(--color-1-darker)" strokeWidth={5}/></div>
    )
}