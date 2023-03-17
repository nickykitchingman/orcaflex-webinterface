import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { Oval } from 'react-loader-spinner';

import './DownloadButton.css';


export default function DownloadButton(props) {
    const { promiseInProgress } = usePromiseTracker({area: props.area}); 

    if (promiseInProgress) {
        return (<div className="download-loading"><Oval width="100%" height="100%" color="var(--color-notice)" secondaryColor="var(--color-1-darker)" strokeWidth={5}/></div>);
    }
    
    return (
        <a className="download-btn" onClick={props.onClick}>
            <i id="download-icon" className="fa fa-download"></i>
        </a>
    );
}