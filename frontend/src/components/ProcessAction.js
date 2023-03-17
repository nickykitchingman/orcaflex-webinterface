import React from 'react';

import './ProcessAction.css';

export default function ProcessAction(props) {
    return (
        <a className="process-action" onClick={props.onClick}>
            <div className="process-name">{props.name}</div>
        </a>
    );
}