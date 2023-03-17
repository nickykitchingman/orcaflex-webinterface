import React from 'react';

import './ProcessPanel.css';


export default function DownloadButton(props) {
    
    return (
        <div>
            <div className="panel-container">
                <a className="panel-btn" onClick={props.onClear}>
                    Clear All
                </a>
                <a className="panel-btn" onClick={props.onPause}>
                    Pause All
                </a>
                <a className="panel-btn" onClick={props.onStop}>
                    Stop All
                </a>
                <a className="panel-btn" onClick={props.onRunPending}>
                    Run Pending
                </a>
                <a className="panel-btn" onClick={props.onRunAll}>
                    Run All
                </a>
            </div>
        </div>
    );
}