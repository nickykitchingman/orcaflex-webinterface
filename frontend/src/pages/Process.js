import React, { useState, useEffect } from 'react';
import './Process.css'

const Process = () => {
    
    const [jobs, setJobs] = useState({'uploads':[], 'processed':[]});
    
    const fetchJobs = () => {
        fetch(
            'http://localhost:5000/jobs'
        ).then(
            res => res.json()).then(
            data => setJobs(data)).catch(
            error => console.log(error)
        );
    }
    
    const processJob = job => {
        console.log(job);
        fetch(
            'http://localhost:5000/processjob',
            {
                method: 'POST',
                body: JSON.stringify({'job': job})
            }
        ).then(
            res => res.json()).then(
            console.log('Success')).catch(
            error => console.log(error)
        );
    }
    
    useEffect(() => {
        fetchJobs();
    }, []);
    
    const uploads = jobs.uploads.map((job) => <li key={job.id} className="vertical"><a onClick={() => processJob(job.id)}>{job.filename}</a></li>);
    const processed = jobs.processed.map((job) => <li key={job.id} className="vertical"><a onClick={() => processJob(job.id)}>{job.filename}</a></li>);

    return (
        <div id="process-page">      
            <h1>Process files</h1>
            <h2>Uploads</h2>
            <ul>{uploads}</ul>
            <h2>Processed</h2>
            <ul>{processed}</ul>
        <div className="space-1"></div>
        </div>
    );
};

export default Process;