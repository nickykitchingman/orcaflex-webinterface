import React, { useState } from 'react';
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
            fetch(api_url('/signup'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',},
                body: JSON.stringify({
                    'username': username, 
                    'password': password
                })
            }).then(
                response => {
                    try {
                        checkStatus(response);      
                        navigate('/login')                  
                    } catch (error) {
                        if (error.toString().includes('418')) {
                            setMessage('Account with this name already exists!')
                            e.target.reset()
                        } else {
                            throw error
                        }
                    }
                }
            ).catch(
                error => {
                    setMessage('Failed to create account!');

                    console.error(error);
                }
            ),
            'signup-area'
        )
    };

    return (
        <div id="signup-page">
            <div className="message">{message}</div>

            <div className="input-fields">
                <form onSubmit={handleSubmit}>
                    <InputField id="username" text="Username" type="text"/>
                    <InputField id="password" text="Password" type="password"/>
                    <input type="Submit" value="Sign Up" />
                </form>
            </div>

            <LoadingDots area="signup-area" />
        </div>
    )
};

export default Login;