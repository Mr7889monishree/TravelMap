import React, { useRef, useState } from 'react';
import './Login.css';
import { Cancel, Room } from '@mui/icons-material';
import axios from 'axios';
import REACT_APP_API_URL from '../Config'; // Import the API URL

const Login = ({ setShowLogin, myStorage, setCurrentUser }) => { // ✅ Corrected `setShowLogin`
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passRef = useRef();

  const handleSubmit = async (e) => {  // ✅ Fixed typo (was `handelSubmit`)
    e.preventDefault(); // Prevent page refresh
    const user = {
      username: nameRef.current.value.trim(),
      password: passRef.current.value.trim(),
    };

    try {
      const res = await axios.post(`${REACT_APP_API_URL}/users/login`, user);
      myStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username);
      setShowLogin(false); // ✅ Corrected function name
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

      <form onSubmit={handleSubmit}>  {/* ✅ Fixed function name */}
        <input type="text" placeholder="Enter Username" ref={nameRef} />
        <input type="password" placeholder="Enter Password" ref={passRef} />
        <button className="login-button">Login</button>
        {error && <span className="failure">Something Went Wrong</span>}
      </form>
      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} /> {/* ✅ Corrected function name */}
    </div>
  );
};

export default Login;
