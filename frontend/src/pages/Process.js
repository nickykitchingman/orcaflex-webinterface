import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './Process.css';
import 'font-awesome/css/font-awesome.min.css';
import { trackPromise } from 'react-promise-tracker';

import { JobStatus } from '../Constants';
import { api_url, checkStatus, refreshToken } from '../Utility';
import ProcessButton from '../components/ProcessButton';
import DownloadButton from '../components/DownloadButton';
import ProcessPanel from '../components/ProcessPanel';

const Process = (props) => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    
    const updateJob = newJob => {
        setJobs(prevJobs => prevJobs.map(job => job.id == newJob.id ? newJob: job));
    }
    
    const updateJobs = newJobs => {
        const chooseJob = (newJob, job) => newJob ? newJob : job;        
        setJobs(prevJobs => prevJobs.map(job => chooseJob(newJobs.find(newJob => newJob.id == job.id), job)));
    } 
    
    const setFailed = ids => {
        setJobs(prevJobs => prevJobs.map(job => ids.includes(job.id) ? { ...job, status: JobStatus.Failed } : job));
    }    
    
    const setRunning = ids => {
        setJobs(prevJobs => prevJobs.map(job => ids.includes(job.id) ? { ...job, status: JobStatus.Running, progress: 'Starting' } : job));
    }
    
    const runningJobs = () => jobs.filter(job => job.status == JobStatus.Running);
    
    const findJob = id => jobs.find(job => job.id == id);
    
    const fetchJobs = () => {
        fetch(
            api_url(`/jobs`),
			{
				headers: { 'Authorization': `Bearer ${props.getToken()}` }
			}
        ).then(
            response => checkStatus(response).json()
        ).then((data) => {
			refreshToken(data, props.setToken);
			setJobs(data);
		}).catch(
            error => {
				console.error(error);
				props.setToken(null);
				navigate("/login");
			}
        );
    }
    
    const fetchRunning = () => {
        let ids = runningJobs().map(job => job.id);
		
        if (ids.length == 0) {
            return;
        }
		
        fetch(
            api_url('/jobs'),
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${props.getToken()}` },
                body: JSON.stringify({'jobs': ids})
            }
        ).then(
            response => checkStatus(response).json()
        ).then((data) => {
			refreshToken(data, props.setToken)
			updateJobs(data.jobs);
		}).catch(
            error => {
				console.error(error);
				props.setToken(null);
				navigate("/login");
			}
        );
    }
    
    const processJob = jobId => {  
        const job = findJob(jobId);
		
        if (job.status == JobStatus.Running) {
            return;
        }
		
        setRunning([jobId]);
		
        fetch(
            api_url('/processjob'),
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${props.getToken()}` },
                body: JSON.stringify({'job': jobId})
            }
        ).then(
            response => checkStatus(response).json()
        ).then((data) => {
			refreshToken(data, props.setToken)
		}).catch(
            error => {
                setFailed([jobId]);
                console.error(error);
				props.setToken(null);
				navigate("/login");
            }
        );
    }
    
    const runSome = ids => {
        if (ids.length == 0) {
            return;
        }
        setRunning(ids);
        fetch(
            api_url('/processjobs'),
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${props.getToken()}` },
                body: JSON.stringify({'jobs': ids})
            }
        ).then(
            response => checkStatus(response).json()
        ).then((data) => {
			refreshToken(data, props.setToken)
		}).catch(
            error => {
                console.error(error);
                setFailed([ids]);
				props.setToken(null);
				navigate("/login");
            }
        )
    }
    
    const runAll = () => {
        let readyJobs = [];
        jobs.forEach(job => {
            if (job.status != JobStatus.Running) {
                readyJobs.push(job.id);
            }
        });
        runSome(readyJobs);
    }
    
    const runPending = () => {
        let pendingJobs = [];
        jobs.forEach(job => {
            if (job.status == JobStatus.Pending) {
                pendingJobs.push(job.id);
            }
        });
        runSome(pendingJobs);
    }
    
    const downloadJob = jobId => trackPromise(
        fetch(
            api_url('/downloadjob'),
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${props.getToken()}` },
                body: JSON.stringify({'job': jobId})
            }
        ).then(
            response => checkStatus(response, props.setToken).blob()
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
           error => {
			    console.error(error)
			    props.setToken(null);
				navigate("/login");
		   }
        ), `download-${jobId}`
    );
    
    const clearJobs = () => {        
        fetch(
            api_url('/clearjobs'),
			{
				headers: { 'Authorization': `Bearer ${props.getToken()}` }
			}
        ).then(
            response => {
				const res = checkStatus(response);
				setJobs(runningJobs());
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
    
    const pauseJobs = () => {
        let jobIds = runningJobs().map(job => job.id);
        
        if (jobs.length == 0) {
            return
        }
        
        fetch(
            api_url('/pausejobs'),
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${props.getToken()}` },
                body: JSON.stringify({ 'jobs': jobIds })
            }
        ).then(
            response => checkStatus(response).json()
        ).then((data) => {
			refreshToken(data, props.setToken)
		}).catch(
            error => {
				console.error(error);
				props.setToken(null);
				navigate("/login");
			}
        );
    }
    
    const stopJobs = () => {    
        let jobIds = runningJobs().map(job => job.id);
        if (jobs.length == 0) {
            return;
        }
        
        fetch(
            api_url('/stopjobs'),
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${props.getToken()}` },
                body: JSON.stringify({'jobs': jobIds})
            }
        ).then(
            response => checkStatus(response).json()
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

    const displayJob = job => (
        <tr key={job.id}>
            <td className="process-col" colSpan={job.status==JobStatus.Complete?"1":"2"}>
                <ProcessButton onClick={() => processJob(job.id)} job={job}/>
            </td>
            {job.status == JobStatus.Complete &&
            (<td className="download-col">
                <DownloadButton area={`download-${job.id}`} onClick={() => downloadJob(job.id)} />
            </td>)}
        </tr>
    );   
    
    const displayJobs = (<table><tbody>{jobs.map((job) => displayJob(job))}</tbody></table>);
    
    const UPDATE_ALL_INTERVAL = 20000;
    const UPDATE_RUNNING_INTERVAL = 2000;
    
    useEffect(() => {
        fetchJobs();        
        const interval = setInterval(fetchJobs, UPDATE_ALL_INTERVAL);  
        
        return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
        const interval = setInterval(fetchRunning, UPDATE_RUNNING_INTERVAL);   
        
        return () => clearInterval(interval);
    }, [jobs]); // Dependency so that the interval uses the latest version of jobs

    return (
        <div id="process-page">      
            <h1>Process jobs</h1>            
            <ProcessPanel onClear={clearJobs} onPause={pauseJobs} onStop={stopJobs} onRunPending={runPending} onRunAll={runAll}/>
            <div className="job-table">{displayJobs}</div>
            <div className="space-1"></div>
        </div>
    );
};

export default Process;