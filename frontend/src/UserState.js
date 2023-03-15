import { useState } from 'react';

const userState = () => {
    const [userState, setUserState] = useState(localStorage.getItem("user-logged-in") === 'true');

    const getState = () => {
        return userState;
    };

    const setState = state => {
        localStorage.setItem("user-logged-in", state);
        setUserState(state);
    };
    
    return { 
        getState: getState,
        setState: setState
    };
};

export default userState;
