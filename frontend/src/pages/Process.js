import React, { useState, useEffect } from 'react';
import './Process.css';
import 'font-awesome/css/font-awesome.min.css';
import { trackPromise } from 'react-promise-tracker';

import LoadingSpinner from '../components/LoadingSpinner';
import StatusSymbol from '../components/StatusSymbol';
import DownloadButton from '../components/DownloadButton';

const Process = () => {
    
    const [jobs, setJobs] = useState([]);
    
    const updateJob = newJob => {
        setJobs(jobs.map(job => job.id == newJob.id ? newJob: job));
    }
    
    const setUnprocessed = id => {
        setJobs(jobs.map(job => job.id == id ? { ...job, status: 1 }: job));
    }
    
    const findJob = id => jobs.find(job => job.id == id);
   
    const checkStatus = reponse => { 
        if (reponse.ok)  {
            return reponse;
        }
        throw new Error(`Error: status code ${reponse.status}`);
    }
    
    const fetchJobs = () => {
        fetch(
            'http://localhost:5000/jobs'
        ).then(
            response => checkStatus(response).json()).then(
            data => setJobs(data)).catch(
            error => console.error(error)
        );
    }
    
    const processJob = job => {        
        setUnprocessed(job);
        trackPromise(
            fetch(
                'http://localhost:5000/processjob',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json',},
                    body: JSON.stringify({'job': job})
                }
            ).then(
                response => checkStatus(response).json()).then(
                data => updateJob(data.job)).catch(
                error => console.error(error)
            ),
            `process-job-${job}`
        );
    }
    
    const downloadJob = jobId => trackPromise(
        fetch(
            'http://localhost:5000/downloadjob',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',},
                body: JSON.stringify({'job': jobId})
            }
        ).then(
            response => checkStatus(response).blob()).then(
            blob => {
                let url = window.URL.createObjectURL(blob);
                let job = findJob(jobId);
                if (job) {
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = job.sim_filename;
                    a.click();
                    window.URL.revokeObjectURL(url);
                    a.remove();
                }
        }).catch(
           error => console.error(error)
        ), `download-${jobId}`
    );
    
    useEffect(() => {
        fetchJobs();
    }, []);

    const displayJob = job => (
        <tr key={job.id}>
            <td className="process-col" colSpan={job.status==2?"1":"2"}>
                <a className="process-btn" onClick={() => processJob(job.id)}>
                    <div>{job.filename}</div>
                    <div className="status-symbol" ><StatusSymbol symbol={job.status}/></div>
                </a>
            </td>
            {job.status == 2 &&
            (<td className="download-col">
                <DownloadButton area={`download-${job.id}`} onClick={() => downloadJob(job.id)} />
            </td>)}
        </tr>
    );   
    
    const displayJobs = (<table><tbody>{jobs.map((job) => displayJob(job))}</tbody></table>);

    return (
        <div id="process-page">      
            <h1>Process jobs</h1>            
            <div className="space-1"></div>
            <div className="job-table">{displayJobs}</div>
            <div className="space-1"></div>
        </div>
    );
};

export default Process;