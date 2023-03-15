import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';

import LoadingDots from '../components/LoadingDots';
import { api_url } from '../Utility';

import './Upload.css';

const Upload = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const allowedExtensions = [".dat", ".sim", ".yml"];

    function checkValid(fileName) {
        const extension = fileName.substr(fileName.lastIndexOf("."));
            if (!allowedExtensions.includes(extension)) {
            setMessage("Invalid file type. Please select a .dat, .sim, or .yml file.");
            return false;
        }
        return true;
    };
    
    const checkStatus = reponse => { 
        if (reponse.ok)  {
            return reponse;
        }
        throw new Error(`Error: status code ${reponse.status}`);
    }

    const handleSubmit = e => {
        e.preventDefault();
		
        const files = e.target.elements['file'].files;
        const formData = new FormData();
		
        if (files.length === 0) {
            setMessage("Please select a file.");
            return;    
        }
		
        for (let i = 0; i < files.length; i++) {
            if (!checkValid(files[i].name)) {
                return;
            }
            formData.append('files', files[i]);
        }
		
        setMessage('');
		
        trackPromise(
            fetch(api_url('/files'), {
                method: 'POST',
                body: formData
            }).then(
                response => {
                    checkStatus(response);
                    setMessage('Files uploaded successfully');
                    navigate('/process');
                }
            ).catch(
                error => {
                    setMessage('An error occurred. Please try again.');
                    console.error(error);
                }
            ),
            'upload-area'
        );
    };

    return (
        <div className="page">      
            <h1 id="heading">Upload Files</h1>
			
            <div className="message">{message}</div>
			
            <form onSubmit={handleSubmit}>
				<div id="form-container">
					<label for="files" className="drop-container">
						<span className="drop-title">Drop Files Here</span>
						<div className="or">or</div>
						<input type="file" name="file" accept=".dat, .yml, .sim" multiple />
					</label>
				</div>
				
                <div className="space-1"></div>
                <input type="submit" value="Upload" />
            </form>
			
            <LoadingDots area="upload-area"/>
        </div>
    );
};

export default Upload;