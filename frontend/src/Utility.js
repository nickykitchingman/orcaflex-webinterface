export const api_url = (url, uid) => {
    if (process.env.REACT_APP_API_URL) {
        const urlInstance = new URL(url, process.env.REACT_APP_API_URL);
		
		if (uid != null) {
			urlInstance.searchParams.append('uid', uid);
		}
		
		return urlInstance
    } else {
        throw new Error('Environment variable \'REACT_APP_API_URL\' is not defined');
    }
}

export const checkStatus = response => { 
    if (response.ok)  {
        return response;
    }

    throw new Error(`Error: status code ${response.status}`);
}