import React from 'react';

export default function InfoPane(props) {
    return (
        <a className="info-pane">
            { props.job.progress }
        </a>
    )
}