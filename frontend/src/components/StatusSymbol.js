import React from 'react';
import { Oval } from 'react-loader-spinner';
import 'font-awesome/css/font-awesome.min.css';

import './StatusSymbol.css';

export default function StatusSymbol(props) {

    switch (props.symbol) {
        case 0:
            return (<i className="fa fa-circle-thin status-pending"></i>)
        case 1:
            return (<div  className="loader"><Oval width="100%" height="100%" color="var(--color-notice)" secondaryColor="var(--color-1-darker)" strokeWidth={5}/></div>)
        case 2:
            return (<i className="fa fa-circle status-complete"></i>)
        case 3:
            return (<i className="fa fa-circle status-failed"></i>)
    }
    
    return (<i></i>)
}