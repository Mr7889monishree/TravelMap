import React, { useRef, useState } from 'react';
import './Register.css';
import { Cancel, Room } from '@mui/icons-material';
import axios from 'axios';
import API_URL from '../Config'; // Correct import

console.log("API_URL:", API_URL);

axios.interceptors.response.use(
    response => response,
    error => {
        console.error('Axios error:', error);
        return Promise.reject(error);
    }
);

const Register = ({ setShowregister }) => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passRef = useRef();

    const handleSubmit = async (e) => { // ✅ Fixed typo: handleSubmit
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passRef.current.value,
        };

        try {
            const res = await axios.post(`${API_URL}/users/register`, newUser);
            console.log("Registration Success:", res.data); // ✅ Debugging
            setError(false);
            setSuccess(true);
        } catch (error) {
            setError(true);
            console.error("Registration error:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="RegisterContainer">
            <div className="logo">
                <Room />
                LamaPin
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='Enter Username' ref={nameRef} required />
                <input type="email" placeholder='Enter MailID' ref={emailRef} required />
                <input type="password" placeholder='Enter Password' ref={passRef} required />
                <button className='Register-button'>Register</button>
                {success && <span className="success">Successful! You can login now</span>}
                {error && <span className="failure">Something went wrong</span>}
            </form>
            <Cancel className='registerCancel' onClick={() => setShowregister(false)} />
        </div>
    );
}

export default Register;
