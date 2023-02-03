import React, { useState } from 'react';

const FileSubmission = () => {
  const [message, setMessage] = useState('');
  
  const allowedExtensions = [".dat", ".sim", ".yml"];

  function checkValid(fileName) {
    const extension = fileName.substr(fileName.lastIndexOf("."));
    if (!allowedExtensions.includes(extension)) {
      setMessage("Invalid file type. Please select a .dat, .sim, or .yml file.");
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
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
    setMessage('Uploading...')
    fetch('http://localhost:5000/files', {
      method: 'POST',
      body: formData
    }).then(
      response => response.blob()).then(
      blob => window.URL.createObjectURL(blob)).then(
      file => { 
        window.location.assign(file);
        setMessage('Files processed successfully');
      }).catch(
        error => setMessage('An error occurred. Please try again.')
    );
  };

  return (
    <div style={{ width: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h1>File submission portal</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" id="file" name="file" accept=".dat,.yml,.sim" multiple />
        <input type="submit" value="Upload" />
      </form>
      <div id="message">{message}</div>
    </div>
  );
};

export default FileSubmission;