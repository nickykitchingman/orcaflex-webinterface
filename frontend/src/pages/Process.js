import React, { useState, useEffect } from 'react';
import './Process.css';
import 'font-awesome/css/font-awesome.min.css';
import { trackPromise } from 'react-promise-tracker';

import ProcessButton from '../components/ProcessButton';
import DownloadButton from '../components/DownloadButton';
import ProcessPanel from '../components/ProcessPanel';

const Process = () => {
    
    const [jobs, setJobs] = useState([]);
    
    const updateJob = newJob => {
        setJobs(jobs.map(job => job.id == newJob.id ? newJob: job));
    }
    
    const updateJobs = newJobs => {
        const chooseJob = (job, newJob) => newJob ? newJob : job;        
        setJobs(jobs.map(job => chooseJob(newJobs.find(newJob => newJob.id == job.id), job)));
    } 
    
    const setFailed = ids => {
        setJobs(jobs.map(job => ids.includes(job.id) ? { ...job, status: 3 } : job));
    }    
    
    const setRunning = ids => {
        setJobs(jobs.map(job => ids.includes(job.id) ? { ...job, status: 1 } : job));
    }
    
    const runningJobs = () => jobs.filter(job => job.status == 1);
    
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
    
    const processJob = jobId => {  
        const job = findJob(jobId);
        if (job.status == 1) {
            return;
        }
        setRunning([jobId]);
        fetch(
            'http://localhost:5000/processjob',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',},
                body: JSON.stringify({'job': jobId})
            }
        ).then(
            response => checkStatus(response).json()
        ).catch(
            error => {
                setFailed([jobId]);
                console.error(error);
            }
        );
    }
    
    const runSome = ids => {
        if (ids.length == 0) {
            return;
        }
        setRunning(ids);
        fetch(
            'http://localhost:5000/processjobs',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',},
                body: JSON.stringify({'jobs': ids})
            }
        ).then(
            response => checkStatus(response).json()
        ).catch(
            error => {
                console.error(error);
                setFailed([ids]);
            }
        )
    }
    
    const runAll = () => {
        let readyJobs = [];
        jobs.forEach(job => {
            if (job.status != 1) {
                readyJobs.push(job.id);
            }
        });
        runSome(readyJobs);
    }
    
    const runPending = () => {
        let pendingJobs = [];
        jobs.forEach(job => {
            if (job.status == 0) {
                pendingJobs.push(job.id);
            }
        });
        runSome(pendingJobs);
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
            response => checkStatus(response).blob()
        ).then(
            blob => {
                let url = window.URL.createObjectURL(blob);
                let job = findJob(jobId);
                if (job) {
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = `${job.filename}.sim`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                    a.remove();
                }
            }
        ).catch(
           error => console.error(error)
        ), `download-${jobId}`
    );
    
    const clearJobs = () => {        
        fetch(
            'http://localhost:5000/clearjobs'
        ).then(
            response => {
                checkStatus(response);
                setJobs(runningJobs());
            }
        ).catch(
            error => console.error(error)
        );
    };
    
    const stopJobs = () => {    
        let jobIds = runningJobs().map(job => job.id);
        if (jobs.length == 0) {
            return;
        }
        
        fetch(
            'http://localhost:5000/stopjobs',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',},
                body: JSON.stringify({'jobs': jobIds})
            }
        ).then(
            response => {
                checkStatus(response);
            }
        ).catch(
            error => console.error(error)
        );
    };

    const displayJob = job => (
        <tr key={job.id}>
            <td className="process-col" colSpan={job.status==2?"1":"2"}>
                <ProcessButton onClick={() => processJob(job.id)} job={job}/>
            </td>
            {job.status == 2 &&
            (<td className="download-col">
                <DownloadButton area={`download-${job.id}`} onClick={() => downloadJob(job.id)} />
            </td>)}
        </tr>
    );   
    
    const displayJobs = (<table><tbody>{jobs.map((job) => displayJob(job))}</tbody></table>);
    
    const STATUS_UPDATE_INTERVAL = 2000;
    
    useEffect(() => {
        fetchJobs();
        
        const interval = setInterval(fetchJobs, STATUS_UPDATE_INTERVAL);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div id="process-page">      
            <h1>Process jobs</h1>            
            <ProcessPanel onClear={clearJobs} onStop={stopJobs} onRunPending={runPending} onRunAll={runAll}/>
            <div className="job-table">{displayJobs}</div>
            <div className="space-1"></div>
        </div>
    );
};

export default Process;