import { useNavigate } from 'react-router-dom';

export const api_url = (url) => {
    if (process.env.REACT_APP_API_URL) 
        return new URL(url, process.env.REACT_APP_API_URL);
    else
        throw new Error('Environment variable \'REACT_APP_API_URL\' is not defined');
}

export const checkStatus = response => { 
    if (response.ok)  {
        return response;
    }

    throw new Error(`Error: status code ${response.status}`);
}