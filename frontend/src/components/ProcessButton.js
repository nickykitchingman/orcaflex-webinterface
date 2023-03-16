import React from 'react';
import StatusSymbol from './StatusSymbol';

import './ProcessButton.css';


export default function DownloadButton(props) {
    
    return (
        <a className="process-btn" onClick={props.onClick}>
            <div id="brief-text">{props.job.filename} <div id="extension">{props.job.extension}</div></div>
            <div className="progress-message">{props.job.progress}</div>
            <div className="status-symbol" ><StatusSymbol symbol={props.job.status}/></div>
        </a>
    );
}