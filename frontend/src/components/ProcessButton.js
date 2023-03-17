import React from 'react';
import { useNavigate } from 'react-router-dom';

import StatusSymbol from './StatusSymbol';
import ProcessAction from './ProcessAction';
import { JobStatus } from '../Constants';
import { api_url, checkStatus, refreshToken } from '../Utility';

import './ProcessButton.css';

export default function ProcessButton(props) {
	const navigate = useNavigate();
	
    const pause = () => {
        fetch(
            api_url('/pausejobs'),
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${props.getToken()}` },
                body: JSON.stringify({ 'jobs': [props.job.id] })
            }
        ).then(
            response => {
				const res = checkStatus(response);
                props.refreshJobs();
                return res.json();
			}
        ).then((data) => {
            refreshToken(data, props.setToken)
        }).catch(
            error => {
                console.error(error);
                props.setToken(null);
                navigate("/login");
            }
        );
	};
	
	const stop = () => {
        fetch(
            api_url('/stopjobs'),
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${props.getToken()}` },
                body: JSON.stringify({ 'jobs': [props.job.id] })
            }
        ).then(
            response => {
				const res = checkStatus(response);
                props.refreshJobs();
                return res.json();
			}
        ).then((data) => {
            refreshToken(data, props.setToken)
        }).catch(
            error => {
                console.error(error);
                props.setToken(null);
                navigate("/login");
            }
        );
	};
	
	const remove = () => {
        fetch(
            api_url('/clearjobs'),
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${props.getToken()}` },
                body: JSON.stringify({ 'jobs': [props.job.id] })
            }
        ).then(
            response => {
				const res = checkStatus(response);
                props.resetJobs();
                return res.json();
			}
        ).then((data) => {
            refreshToken(data, props.setToken)
        }).catch(
            error => {
                console.error(error);
                props.setToken(null);
                navigate("/login");
            }
        );
	};
	
    return (
        <div className="process-btn">
			{props.job.filename} <div id="extension">.{props.job.extension}</div>
			
			<div className="btn-container">
				{ props.job.status != JobStatus.Running && <ProcessAction name="Run" onClick={props.onClick} /> }
				{ props.job.status == JobStatus.Running && <ProcessAction name="Pause" onClick={pause} /> }
				{ props.job.status == JobStatus.Running && <ProcessAction name="Stop" onClick={stop} /> }
				{ props.job.status != JobStatus.Running && <ProcessAction name="Remove" onClick={remove} /> }
			</div>
			
            <div className="progress-message">
				{props.job.progress}
			</div>
			
            <div className="status-symbol" >
				<StatusSymbol symbol={props.job.status}/>
			</div>
        </div>
    );
}