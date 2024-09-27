import React, { useState } from 'react';
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


// validate the form
const validateForm = () => {
  if (!username || !password) {
    setError('Username and password are required');
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

    const formDetails =  new URLSearchParams();
    formDetails.append('username', username);
    formDetails.append('password', password);
    
    try {
      const response = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formDetails
      });

      const data = await response.json();

      setLoading(false);

      console.log('Login successful:', data);
      // Handle successful login (e.g., store token, redirect to dashboard)
      navigate('/protected');
      localStorage.setItem('token', data.token);
   } catch (error) {
      console.error('Login failed:', error);
      //setError(error.response?.data?.detail || 'An error occurred during login');
      setError('An error occurred during login');

    } 

};

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input 
          type="text" 
          id="username" 
          name="username" 
          required 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="login-button">Log In</button>
    </form>
  );
}


export default Login;
