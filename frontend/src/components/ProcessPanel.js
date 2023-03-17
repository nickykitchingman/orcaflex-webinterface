import React from 'react';

import './ProcessPanel.css';


export default function DownloadButton(props) {
    
    return (
        <div>
            <div className="panel-container">
                <a className="panel-btn" onClick={props.onClear}>
                    Clear all
                </a>
                <a className="panel-btn" onClick={props.onPause}>
                    Pause all
                </a>
                <a className="panel-btn" onClick={props.onStop}>
                    Stop all
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