import React from 'react';

import './ProcessPanel.css';


export default function DownloadButton(props) {
    
    return (
        <div>
            <div className="panel-container">
                <a className="panel-btn" onClick={props.onClear}>
                    Clear
                </a>
                <a className="panel-btn" onClick={props.onPause}>
                    Pause
                </a>
                <a className="panel-btn" onClick={props.onStop}>
                    Stop
                </a>
                <a className="panel-btn" onClick={props.onRunPending}>
                    Run pending
                </a>
                <a className="panel-btn" onClick={props.onRunAll}>
                    Run all
                </a>
            </div>
        </div>
    );
}