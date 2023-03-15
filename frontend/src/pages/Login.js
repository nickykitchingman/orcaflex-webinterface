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
            fetch(api_url('/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',},
                body: JSON.stringify({
                    'username': username, 
                    'password': password
                })
            }).then(
                response => {
                    checkStatus(response);
                    props.setState(true);
                    setMessage('Login successful!')
                }
            ).catch(
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
        if (props.getState()) {
            navigate('/home');
        }
    }, [props.getState])

    return (
        <div className="page">
			<h1 id="heading">Login</h1>
			
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