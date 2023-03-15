import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';

import InputField from '../components/InputField';
import LoadingDots from '../components/LoadingDots';

import { api_url, checkStatus } from '../Utility';

import './Login.css';

import userState from '../UserState';

const Login = (props) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const handleSubmit = e => {
        e.preventDefault()

        const username = e.target.elements['username'].value;
        const password = e.target.elements['password'].value;
		
        trackPromise(
            fetch(api_url('/login', null), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',},
                body: JSON.stringify({
                    'username': username, 
                    'password': password
                })
            })
			.then((response) => response.json())
			.then((result) => {
				const uid = result.uid;
				props.setUID(uid);
				console.log(props.getUID());
			})
			.catch(
                error => {
                    setMessage('Invalid login!');
                    console.error(error);

                    e.target.reset()
                }
            ),
            'login-area'
        )
    };
    
    useEffect(() => {
        if (props.getUID() != 'null') {
            navigate('/home');
        }
    }, [props.getUID])

    return (
        <div id="login-page">
            <div className="message">{message}</div>

            <div className="input-fields">
                <form onSubmit={handleSubmit}>
                    <InputField id="username" text="Username" type="text"/>
                    <InputField id="password" text="Password" type="password"/>
                    <input type="Submit" value="Login" />
                </form>
            </div>

            <LoadingDots area="login-area" />
        </div>
    )
};

export default Login;