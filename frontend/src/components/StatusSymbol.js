import React from 'react';
import { Oval } from 'react-loader-spinner';

import 'font-awesome/css/font-awesome.min.css';
import './StatusSymbol.css';

import { JobStatus } from '../Constants';

export default function StatusSymbol(props) {

    switch (props.symbol) {
        case JobStatus.Pending:
            return (<i className="fa fa-circle-thin status-pending"></i>)
        case JobStatus.Running:
            return (<div className="loader"><Oval width="100%" height="100%" color="var(--color-notice)" secondaryColor="var(--color-1-darker)" strokeWidth={5}/></div>)
        case JobStatus.Complete:
            return (<i className="fa fa-circle status-complete"></i>)
        case JobStatus.Failed:
            return (<i className="fa fa-circle status-failed"></i>)
		case JobStatus.Paused:
			return (<i className="fa fa-circle status-paused"></i>)
        case JobStatus.Cancelled:
            return (<i className="fa fa-circle status-cancelled"></i>)
    }
    
    return (<i></i>)
}