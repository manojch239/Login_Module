import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedPage from './Protected';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <div className="App">
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
          <Route path="/protected" element={
            <PrivateRoute>
              <ProtectedPage />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
