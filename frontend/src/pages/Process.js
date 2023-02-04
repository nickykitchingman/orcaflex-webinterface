import React, { useState, useEffect } from 'react';
import './Process.css'
import 'font-awesome/css/font-awesome.min.css';

const Process = () => {
    
    const [jobs, setJobs] = useState({'uploads':[], 'processed':[]});
    
    const fetchJobs = () => {
        fetch(
            'http://localhost:5000/jobs'
        ).then(
            res => res.json()).then(
            data => setJobs(data)).catch(
            //error => console.log(error)
            setJobs({'uploads':[{'filename':'model1.dat', 'id':'0'}, {'filename':'model2.dat', 'id':'1'}], 'processed':[]})
        );
    }
    
    const processJob = job => {
        fetch(
            'http://localhost:5000/processjob',
            {
                method: 'POST',
                body: JSON.stringify({'job': job})
            }
        ).then(
            res => res.json()).then(
            console.log(`Processed ${job}`)).catch(
            error => console.log(error)
        );
    }

    const downloadJob = job => {
        console.log(job);
        fetch(
            'http://localhost:5000/downloadjob',
            {
                method: 'POST',
                body: JSON.stringify({'job': job})
            }
        ).then(
            res => res.json()).then(
            console.log(`Downloaded ${job}`)).catch(
            error => console.log(error)
        );
    }
    
    useEffect(() => {
        fetchJobs();
    }, []);

    const displayJob = job => (
        <tr key={job.id}>
            <td className="process-col"><a className="process-btn" onClick={() => processJob(job.id)}>{job.filename}</a></td>
            <td className="download-col">
                <btn className='download-btn' onClick={() => downloadJob(job.id)}>
                    <i className="fa fa-download"></i>
                </btn>
            </td>
        </tr>
    );   
    
    const uploads = jobs.uploads.map((job) => displayJob(job));
    const processed = jobs.processed.map((job) => displayJob(job));

    return (
        <div id="process-page">      
            <h1>Process files</h1>
            <h2>Uploads</h2>
            <div className="job-table"><table>{uploads}</table></div>
            <h2>Processed</h2>
            <div className="job-table"><table>{processed}</table></div>
            <div className="space-1"></div>
        </div>
    );
};

export default Process;