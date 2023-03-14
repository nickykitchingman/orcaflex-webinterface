import React from 'react'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"

import Home from '../pages/Home'
import Upload from '../pages/Upload'
import Process from '../pages/Process'
import Error from '../pages/Error'
import Login from '../pages/Login'

const Router = () => {
    return (
        <BrowserRouter>        
            <Routes>   
                <Route 
                    path="/" 
                    element={<Navigate to="/home" />}
                />
                <Route 
                    path="/home" 
                    element={<Home />}  
                    errorElement={<Error />}
                />
                <Route 
                    path="/upload" 
                    element={<Upload />}  
                    errorElement={<Error />}
                />     
                <Route 
                    path="/process" 
                    element={<Process />}  
                    errorElement={<Error />}
                />    
                <Route
                    path="/login"
                    element={<Login />}
                    errorElement={<Error />}
                />
            </Routes>        
        </BrowserRouter>
    );
}

export default Router;