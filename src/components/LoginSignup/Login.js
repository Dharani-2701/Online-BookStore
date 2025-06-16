import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginSignup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'adminobs@gmail.com' && password === 'aobs') {
      localStorage.setItem('authToken', 'adminToken'); // Dummy token for admin
      localStorage.setItem('loggedInUserId', email);
      navigate('/admin-dashboard'); // Redirect to Admin Dashboard
    } else {
      fetch('http://localhost:5000/users')
        .then(async (res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          const data = await res.json();
          const user = data.find(user => user.email === email && user.password === password);
          if (!user) {
            alert("Invalid email or password");
          } else {
            localStorage.setItem('authToken', '123456'); // Dummy token
            localStorage.setItem('loggedInUserId', user.email); // Store the user's email in localStorage
            navigate('/dashboard'); // Redirect to Dashboard
          }
        })
        .catch((err) => alert("Login failed: " + err.message));
    }
  };
  

  
  return (
    <div className='background-login-signup'>
      <div className='Container'>
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
        <FontAwesomeIcon icon={faEnvelope}  className='icon'/>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder='Email' required />
        </div>
        <div className="input">
        <FontAwesomeIcon icon={faLock}  className='icon'/>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder='Password' required />
        </div>
      </div>
      <div className="forgot-password">Lost password? <span>Click Here</span></div>
      <div className="submit-container">
        <div className="submit" onClick={handleLogin}>Login</div>
      </div>
      <p className='already'>Don't have an account? <Link to="/signup">Sign up here</Link></p>
    </div>
    </div>
  );
}

export default Login;
