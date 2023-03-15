export const api_url = (url) => {
    if (process.env.REACT_APP_API_URL) {
		return new URL(url, process.env.REACT_APP_API_URL);
    } else {
        throw new Error('Environment variable \'REACT_APP_API_URL\' is not defined');
    }
}

export const checkStatus = (response, setToken) => { 
	if (response.body.token != null) {
		setToken(response.json().token);
	}
	
    if (response.ok)  {
        return response;
    }

    throw new Error(`Error: status code ${response.status}`);
}