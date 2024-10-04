import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {Spin } from 'antd';
import Login from './Login';
import Register from './Register';
import ProtectedPage from './Protected';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);  
  const [loading, setLoading] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
  };

useEffect(() => {
  const timer = setTimeout(()=> {
    setLoading(false);
  },2000);
  return () => clearTimeout(timer);
},[]);


  return (
    <Router>
      <div className="App">
        {loading?(
          <Spin size = "large" />
        ) : ( 
        <Routes>
          <Route path="/" element={
            <div className="login-container">
              <h2 className="login-title">{isLogin ? 'Login' : 'Register'}</h2>
              {isLogin ? <Login /> : <Register />}
              <button onClick={toggleForm} className="toggle-form">
                {isLogin ? 'Don\'t have an account? Register here' : 'Already have an account? Login here'}
              </button>
            </div>
          } />
          <Route path="/login" element={
            <div className="login-container">
              <h2 className="login-title">Login</h2>
              <Login />
              <button onClick={toggleForm} className="toggle-form">
                Don't have an account? Register here
              </button>
            </div>
          } />  // Updated Login route to match the "/" structure
          <Route path="/protected" element={
            <PrivateRoute>
              <ProtectedPage />
            </PrivateRoute>
          } />
        </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
