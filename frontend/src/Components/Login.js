import React, { useRef, useState } from 'react';
import './Login.css';
import { Cancel, Room } from '@mui/icons-material';
import axios from 'axios';
import API_URL from '../Config'; // Import the API_URL

const Login = ({ setShowlogin, myStorage, setCurrentUser }) => {
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passRef = useRef();

  const handelSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    const user = {
      username: nameRef.current.value,
      password: passRef.current.value,
    };

    try {
      const res = await axios.post(`${API_URL}/users/login`, user); // Use API_URL
      myStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username);
      setShowlogin(false);
      setError(false);
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <Room />
        LamaPin
      </div>

      <form onSubmit={handelSubmit}>
        <input type="text" placeholder='Enter Username' ref={nameRef} />
        <input type="password" placeholder='Enter Password' ref={passRef} />
        <button className='login-button'>Login</button>
        {error && (<span className="failure">Something Went Wrong</span>)}
      </form>
      <Cancel className='loginCancel' onClick={() => setShowlogin(false)} />
    </div>
  );
};

export default Login;
