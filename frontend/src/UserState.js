import { useState } from 'react';

const userState = () => {
    const [userState, setUserState] = useState(localStorage.getItem("user-logged-in") === 'true');

    const getState = () => {
        return userState;
    };

    const setState = async (state) => {
        setUserState(state);
        localStorage.setItem("user-logged-in", state);
    };
    
    return { 
        getState: getState,
        setState: setState
    };
};

export default userState;
