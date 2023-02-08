import React from 'react';
import StatusSymbol from './StatusSymbol';

import './ProcessButton.css';


export default function DownloadButton(props) {
    
    return (
        <a className="process-btn" onClick={props.onClick}>
            <div>{props.job.filename}</div>
            <div className="status-symbol" ><StatusSymbol symbol={props.job.status}/></div>
        </a>
    );
}