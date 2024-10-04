import React, { useState } from 'react';
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  //const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !password || !confirmPassword) { //changed the email to username for the register form
      setError('All fields are required');
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');


    // const formDetails = new URLSearchParams();
    // formDetails.append('username', username);
    //formDetails.append('email', email);
    // formDetails.append('password', password);
    // formDetails.append('confirmPassword', confirmPassword);


    const formDetails = {
      username : username,
      password : password,
    };

    try {
      const response = await fetch('http://localhost:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // changed the format from "x-www-form-urlencoded" to "json"
          // 'Authorization': `Bearer`
        },
        body: JSON.stringify(formDetails)
      });

      const data = await response.json();
      console.log(data)
      if(!response.ok){
        if (data.detail === "Username already exists") {
          alert(data.detail);
        }
        else {
          setError(data.detail);
        } return;
      }
        // return;
      setLoading(false);

    //change response.data to data and error.response?.data to error  
      console.log('Registration successful:', data);
      if ("message" in data && data.message) {
        localStorage.setItem('message', data.message);
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    // <form className="register-form" onSubmit={handleSubmit}>
    //   {error && <div className="error-message">{error}</div>}
    //   <div className="form-group">
    //     <label htmlFor="email">Email</label>
    //     <input 
    //       type="email" 
    //       id="email" 
    //       name="email" 
    //       required 
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //       disabled={loading}
    //     />
    //   </div>


<form className="register-form" onSubmit={handleSubmit}>
  {error && <div className="error-message">{error}</div>}
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input 
          type="username" 
          id="username" 
          name="username" 
          required 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
        </div>
 {/* ---------------------------------------------------------------------------------------- */}
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input 
          type="password" 
          id="confirmPassword" 
          name="confirmPassword" 
          required 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />
      </div>
      <button type="submit" className="register-button" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}

export default Register;
