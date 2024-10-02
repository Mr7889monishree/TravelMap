import React, { useRef, useState } from 'react';
import './Register.css';
import { Cancel, Room } from '@mui/icons-material';
import axios from 'axios';
import API_URL from '../Config'; // Adjust the path if needed

// Log the API URL for debugging
console.log("API_URL: ", API_URL);

// Axios Interceptor for logging errors
axios.interceptors.response.use(
    response => response,
    error => {
        console.error('Axios error:', error); // Log any Axios errors
        return Promise.reject(error);
    }
);

const Register = ({ setShowregister }) => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passRef = useRef();

    const handelSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passRef.current.value,
        };
        try {
            await axios.post(`${API_URL}/users/register`, newUser);
            setError(false);
            setSuccess(true);
        } catch (error) {
            setError(true);
            console.error("Registration error: ", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="RegisterContainer">
            <div className="logo">
                <Room />
                LamaPin
            </div>
            <form onSubmit={handelSubmit}>
                <input type="text" placeholder='Enter Username' ref={nameRef} />
                <input type="email" placeholder='Enter MailID' ref={emailRef} />
                <input type="password" placeholder='Enter Password' ref={passRef} />
                <button className='Register-button'>Register</button>
                {success && (
                    <span className="success">Successful! You can Login now</span>
                )}
                {error && (
                    <span className="failure">Something Went Wrong</span>
                )}
            </form>
            <Cancel className='registerCancel' onClick={() => setShowregister(false)} />
        </div>
    );
}

export default Register;
